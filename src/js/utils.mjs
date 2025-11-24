
export async function loadTemplate(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load template: ${url}`);
  const text = await res.text();
  return async () => text;
}


export async function renderWithTemplate(
  templateFn,
  parentElement,
  data = null,
  callback = null,
  position = "afterbegin",
  clear = true
) {
  const template = await templateFn();
  if (clear) parentElement.innerHTML = "";
  parentElement.insertAdjacentHTML(position, template);
  if (callback) callback(data);
}


export function renderListTemplate(templateFn, parentElement, list, position = "afterbegin", clear = true) {
  if (clear) parentElement.innerHTML = "";
  const htmlString = list.map(templateFn);
  parentElement.insertAdjacentHTML(position, htmlString.join(""));
}


export async function loadHeaderFooter() {
  const headerTemplateFn = await loadTemplate("/partials/header.html");
  const footerTemplateFn = await loadTemplate("/partials/footer.html");

  const headerElement = document.querySelector("#default-header");
  const footerElement = document.querySelector("#default-footer");

  if (headerElement) await renderWithTemplate(headerTemplateFn, headerElement);
  if (footerElement) await renderWithTemplate(footerTemplateFn, footerElement);
}
