# frozen_string_literal: true

class ArticlesReportWorker
  include Sidekiq::Worker
  include ActionView::Helpers::TranslationHelper

  def perform(user_id, user_email)
    ActionCable.server.broadcast(user_email, { message: t("report.render"), progress: 25 })
    publish_articles = Article.where("user_id = ? and status = ?", user_id, "Published")
    content = ApplicationController.render(
      assigns: {
        articles: publish_articles
      },
      template: "api/admin/articles/report/download",
      layout: "pdf"
    )
    ActionCable.server.broadcast(user_email, { message: t("report.generate"), progress: 50 })
    pdf_blob = WickedPdf.new.pdf_from_string content
    current_user = User.find_by!(id: user_id)
    if current_user.report.attached?
      current_user.report.purge_later
    end
    current_user.report.attach(
      io: StringIO.new(pdf_blob), filename: "scribble_articles_report.pdf",
      content_type: "application/pdf")
    current_user.save
    ActionCable.server.broadcast(user_email, { message: t("report.generated"), progress: 100 })
  end
end
