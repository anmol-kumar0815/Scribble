# frozen_string_literal: true

json.articles @articles do | article |
  json.partial! "api/admin/articles/article", article: article
  json.visits article.visits.sum(:counts)
  json.visits_along_date article.visits
end

json.count @count
