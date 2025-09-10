import {
  getCurrentTab,
  setDomainConfig,
  getDomainConfig,
  parseValue,
} from '../utils';

export const FormEvent = 'config';
export const FormConfigId = 'config-form';

document.getElementById(FormConfigId)?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const form = e.target as HTMLFormElement;
  const formData = new FormData(form);
  const values = parseValue(Object.fromEntries(formData.entries()));

  console.log('Form config: ', values);
  const tab = await getCurrentTab();

  if (!tab.url) return;
  const domain = new URL(tab.url).hostname;
  await setDomainConfig(domain, values);
  const event = new Event(FormEvent);
  document.dispatchEvent(event);
});

async function updateFormData() {
  console.log('updateFormData');

  const form = document.getElementById(FormConfigId) as HTMLFormElement | null;
  const tab = await getCurrentTab();

  if (!tab.url || !form) return;

  const domain = new URL(tab.url).hostname;
  const config = await getDomainConfig(domain);

  console.log(form.elements.namedItem('pandingTime'));

  (form.elements.namedItem('pandingTime') as HTMLInputElement).value = String(
    config.pandingTime || 5000
  );

  (form.elements.namedItem('urlMacros') as HTMLInputElement).value =
    config.urlMacros || 'None';
}

document.addEventListener(FormEvent, async function (e) {
  console.log('Event listner', e);
  updateFormData();
});
document.addEventListener('DOMContentLoaded', updateFormData);
