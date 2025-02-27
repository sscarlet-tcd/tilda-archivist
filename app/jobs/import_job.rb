# frozen_string_literal: true

module ImportJob
  class Basic
    include Sidekiq::Worker

    sidekiq_options queue: 'in_and_out'

    def run(importer, options = {})
      begin
        trap 'TERM' do

          importer.cancel
          self.class.perform_async(importer.object.id, options)

          exit 0
        end

        importer.import options
      rescue => e
        Rails.logger.fatal 'Fatal error while importing'
        Rails.logger.fatal e.message
      end
    end
  end
end

class ImportJob::Instrument < ImportJob::Basic

  def perform(document_id, options = {})
    doc = Nokogiri::XML(Document.find(document_id).file_contents)
    case doc.root.name.downcase
      when 'qsrx'
        run(Importers::XML::QSRX::Specification.new(document_id), options)
      when 'ddiinstance'
        run(Importers::XML::DDI::Instrument.new(document_id,options), options)
      else
        Rails.logger.error 'Could recognise file type for instrument import.'
    end
  end
end

class ImportJob::Dataset < ImportJob::Basic
  def perform(document_id, options = {})
    run(Importers::XML::DDI::Dataset.new(document_id,options), options)
  end
end

class ImportJob::Mapping < ImportJob::Basic
  def perform(document_id, options = {})
    run(Importers::TXT::Mapper::Mapping.new(document_id, options), options)
  end
end

class ImportJob::DV < ImportJob::Basic
  def perform(document_id, options = {})
    run(Importers::TXT::Mapper::DV.new(document_id, options), options)
  end
end

class ImportJob::TopicQ < ImportJob::Basic
  def perform(document_id, options = {})
    run(Importers::TXT::Mapper::TopicQ.new(document_id, options), options)
  end
end

class ImportJob::TopicV < ImportJob::Basic
  def perform(document_id, options = {})
    run(Importers::TXT::Mapper::TopicV.new(document_id, options), options)
  end
end