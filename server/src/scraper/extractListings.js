function extractListings() {
  const cards = Array.from(
    document.querySelectorAll('[data-testid="listing-card"]')
  );

  return cards.map((card) => {
    const name =
      card.querySelector("a.text-subheading-medium")?.innerText.trim() || "N/A";
    const address =
      card.querySelector("div.text-slate-light span")?.innerText.trim() ||
      "N/A";
    const priceElement = card.querySelector(
      ".text-subheading-medium.whitespace-pre-wrap"
    );
    const price = priceElement?.innerText.replace(/\s+/g, " ").trim() || "N/A";
    const image =
      card
        .querySelector(".LazyLoad.is-visible img")
        ?.getAttribute("data-src") || "Nothing found";

    return {
      name,
      address,
      price,
      image,
    };
  });
}

module.exports = extractListings;
