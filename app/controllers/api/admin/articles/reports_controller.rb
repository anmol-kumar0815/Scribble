# frozen_string_literal: true

class Api::Admin::Articles::ReportsController < ApplicationController
  def create
    user = current_user
    ArticlesReportWorker.perform_async(user.id, user.email)
  end

  def download
    unless current_user.report.attached?
      respond_with_error(t("not_found", entity: "report"), :not_found) and return
    end

    send_data current_user.report.download, filename: pdf_file_name, content_type: "application/pdf"
  end

  private

    def pdf_file_name
      "scribble_articles_report.pdf"
    end
end
