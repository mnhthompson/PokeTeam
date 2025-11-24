export async function loadHeaderFooter(){

  const headerTemplateFn = loadTemplate("/partials/header.html");
  const footerTemplateFn = loadTemplate("/partials/footer.html");
  

  const headerElement = document.querySelector("#default-header");
  const footerElement = document.querySelector("#default-footer");
  

  await renderWithTemplate(headerTemplateFn, headerElement);
  await renderWithTemplate(footerTemplateFn, footerElement);
}