class ArticleFilterService
  attr_reader :user_id, :selected_category_ids, :selected_status, :searched_term

  def initialize(user_id, selected_category_ids, selected_status, searched_term)
    @user_id = user_id
    @selected_category_ids = selected_category_ids
    @selected_status = selected_status
    @searched_term = searched_term&.strip
  end

  def process
    filters = { user_id: }
    filters[:category_id] = selected_category_ids if selected_category_ids.present?
    filters[:status] = selected_status if selected_status.present? && selected_status != "All"

    Article.search(searched_term.presence || "*", where: filters, order: { updated_at: :desc })
  end
end
