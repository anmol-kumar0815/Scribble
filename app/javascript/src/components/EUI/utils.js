import dayjs from "dayjs";

export const formatDateToMonthDayYear = dateTime =>
  dayjs(dateTime).format("MMMM D, YYYY");

export const getCurrentDate = () => dayjs(new Date()).format("YYYY-MM-DD");

export const findDefaultPath = (
  categories,
  setActiveSlug,
  setActiveArticleCategoryIndex
) => {
  const defaultCategory = categories.find(
    category => category.articles.length !== 0
  );
  if (defaultCategory !== undefined) {
    setActiveSlug(defaultCategory.articles[0].slug);
    setActiveArticleCategoryIndex(categories.indexOf(defaultCategory));
  }
};

export const findActiveArticleIndex = (
  categories,
  setActiveArticleCategoryIndex,
  setActiveSlug
) => {
  let isSlugMatch = false;

  categories.forEach((category, index) =>
    category.articles.filter(article => {
      const path = window.location.pathname.split("/");
      const currentSlug = path[path.length - 1];
      const slugMatched = article.slug === currentSlug;
      if (slugMatched) {
        isSlugMatch = true;
        setActiveSlug(currentSlug);
        setActiveArticleCategoryIndex(index);
      }
    })
  );
  if (!isSlugMatch && window.location.pathname !== "/public") {
    setActiveArticleCategoryIndex(-1);
  }
};

export const buildSearchOptions = (options, setOptions) => {
  const buildOptions = options.map(option => ({
    label: option.title,
    value: option.slug,
  }));
  setOptions(buildOptions);
};
