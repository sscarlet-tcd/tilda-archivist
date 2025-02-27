# frozen_string_literal: true

class DatasetsController < ImportableController
  include Importers::Controller

  only_set_object { %i{ questions dv latest_document } }

  has_importers({
                  dv: ImportJob::DV,
                  topicv: ImportJob::TopicV
  })

  #skip_before_action :authenticate_user!, only: [:latest_document, :dv]

  @model_class = ::Dataset
  @params_list = [:name, :doi, :study]
  @model_importer_class = ImportJob::Dataset

  def index
    @var_counts = Variable.group(:dataset_id).size
    @qv_counts = QvMapping.group(:dataset_id).size
    @dv_counts = DvMapping.group(:dataset_id).size
    super
  end

  def show
    if params[:questions]
      render 'show_with_questions'
    else
      render
    end
  end

  def dv
    respond_to do |format|
      format.text { render 'dv.txt.erb', layout: false, content_type: 'text/plain' }
      format.json  {}
    end
  end

  def latest_document
    d = @object.documents.last
    if d.nil?
      head :ok
    else
      render body: d.file_contents, content_type: 'application/xml'
    end
  end

  # Destroy action queues a job to destroy a dataset
  def destroy
    begin
      DeleteJob::Dataset.perform_async(@object.id)
      head :ok, format: :json
    rescue => e
      logger.fatal 'Failed to destroy dataset'
      logger.fatal e.message
      logger.fatal e.backtrace
      render json: {message: e}, status: :bad_request
    end
  end

  # Used by importing the TXT instrument files that mapper used
  # Please note that for multiple upload to work within a nested
  # Angular 1.X form, base64 encoding was needed so we need to
  # decode the file here as well
  def member_imports
    imports = params[:imports].nil? ? [] : params[:imports]
    head :ok, format: :json if imports.empty?
    begin
      imports.each do |import|
        doc = Document.new file: Base64.decode64(import[:file])
        doc.save_or_get
        type = import[:type]&.downcase&.to_sym

        if type == :dv
          import = Import.create(document_id: doc.id, import_type: 'ImportJob::DV', dataset_id: params[:id], state: :pending)
          ImportJob::DV.perform_async(doc.id, {object: params[:id], import_id: import.id})
        elsif type == :topicv
          import = Import.create(document_id: doc.id, import_type: 'ImportJob::TopicV', dataset_id: params[:id], state: :pending)
          ImportJob::TopicV.perform_async(doc.id, {object: params[:id], import_id: import.id})
        end
      end
      head :ok, format: :json
    rescue  => e
      render json: {message: e}, status: :bad_request
    end
  end

  def collection
    policy_scope(Dataset).includes(:instruments)
  end
end
