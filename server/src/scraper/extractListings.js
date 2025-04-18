function extractListings() {
  const cards = Array.from(
    document.querySelectorAll('[data-testid="listing-card"]')
  ).slice(0, 5);

  return cards.map((card) => {
    const name =
      card.querySelector("a.text-subheading-medium")?.innerText.trim() || "N/A";
    const address =
      card.querySelector("div.text-slate-light span")?.innerText.trim() ||
      "N/A";
    const phone = card.querySelector("a.phone-link")?.innerText.trim() || "N/A";
    const priceElement = card.querySelector(
      ".text-subheading-medium.whitespace-pre-wrap"
    );
    const price = priceElement?.innerText.replace(/\s+/g, " ").trim() || "N/A";
    const image =
      card
        .querySelector(".LazyLoad.is-visible img")
        ?.getAttribute("data-src") || "Nothing found";
    const unitDetails = Array.from(card.querySelectorAll(".text-caption"))
      .map((el) => el.innerText.trim())
      .filter(Boolean);
    const badges = Array.from(
      card.querySelectorAll('[data-testid="card-badges-section"] div')
    ).map((el) => el.innerText.trim());
    const amenitiesSection = card.querySelector(
      ".text-caption-bold:has(+ .text-caption)"
    );
    const amenities =
      amenitiesSection?.nextElementSibling?.innerText.trim() || "N/A";

    return {
      name,
      address,
      phone,
      price,
      image,
      unitDetails,
      badges,
      amenities,
    };
  });
}

module.exports = extractListings;
