const {test,expect}=require('@playwright/test');

test('welcome, Option 2 FAQ search and keyboard close work without a chat backend',async({page})=>{
  await page.goto('/');await page.getByRole('button',{name:'Open Flyo Travel Support',exact:true}).click();
  await expect(page.getByText('Welcome to Flyo Travel & Tourism! How can we help you?',{exact:true})).toBeVisible();
  await page.getByRole('button',{name:'Frequently Asked Questions',exact:true}).click();
  const dialog=page.getByRole('dialog');await dialog.getByRole('searchbox').fill('visa approval');
  await dialog.getByText('Is visa approval guaranteed?',{exact:true}).click();
  await expect(dialog.getByText(/No. Visa approval is solely/)).toBeVisible();
  await dialog.getByRole('searchbox').fill('qwerty-no-answer');await expect(dialog.getByText(/No matching questions/)).toBeVisible();
  await page.keyboard.press('Escape');await expect(dialog).not.toBeVisible();
  await expect(page.getByRole('button',{name:'Open Flyo Travel Support',exact:true})).toBeFocused();
});

test('public FAQ page exposes all 36 answers and current business contacts',async({page})=>{
  await page.goto('/faq');const faq=page.locator('#faq-browser');await expect(faq.getByText('36 answers found',{exact:true})).toBeVisible();
  await faq.getByRole('searchbox').fill('How can I contact');await faq.getByText('How can I contact FLY O Tours & Travel?',{exact:true}).click();
  await expect(faq.getByText(/UAE WhatsApp: \+971 50 535 7300/)).toBeVisible();
});

for(const slug of ['thailand-bangkok-pattaya-group-package','japan-tokyo-osaka','scandinavian-wonders','rovaniemi-helsinki-group-tour']){
  test(`package enquiry retains its package context: ${slug}`,async({page})=>{
    // Simulated unavailable backend tests the failure state only, never delivery.
    await page.route('https://*.supabase.co/**',route=>route.abort());
    await page.goto(`/packages/${slug}/`);
    await page.locator('#pricingGrid [data-flyo-chat]').first().click();
    const dialog=page.getByRole('dialog');await expect(dialog).toBeVisible();
    await expect(dialog.getByLabel('Selected package',{exact:true})).toHaveValue(/.+/);
    await expect(dialog.getByLabel('Destination or package',{exact:true})).not.toHaveValue('');
    await expect(page.locator('#heroActions [data-whatsapp-package]')).toHaveCount(1);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
  });
}

test('an unavailable backend keeps entered details and never claims the enquiry was saved',async({page})=>{
  await page.route('https://*.supabase.co/**',route=>route.abort());await page.goto('/faq');
  await page.getByRole('button',{name:'Open Flyo Travel Support',exact:true}).click();await page.getByRole('button',{name:'Chat with Our Team',exact:true}).click();
  const dialog=page.getByRole('dialog');await dialog.getByLabel('Your name',{exact:true}).fill('Test Traveller');
  await dialog.getByLabel('WhatsApp / mobile number',{exact:true}).fill('+971500000000');
  await dialog.getByLabel('Your message',{exact:true}).fill('Please send travel options.');await dialog.getByRole('checkbox').check();
  await dialog.getByRole('button',{name:'Send enquiry',exact:true}).click();
  await expect(dialog.getByLabel('Your message',{exact:true})).toHaveValue('Please send travel options.');
  await expect(dialog.getByText('Your enquiry is saved. Our travel team can reply here.',{exact:true})).not.toBeVisible();
});

test('staff login stays protected without credentials',async({page})=>{
  await page.goto('/admin/live-chat');await expect(page.getByRole('button',{name:'Sign in to travel support',exact:true})).toBeVisible();
  await expect(page.locator('#workspace')).toBeHidden();
  await page.addInitScript(()=>localStorage.setItem('flyoAdminAuthenticated','true'));
  await page.goto('/admin/');await expect(page.locator('[data-auth-shell]')).toBeHidden();
  await expect(page.locator('#adminPassword')).toBeVisible();await expect(page.getByText('Local fallback password:',{exact:false})).toHaveCount(0);
});

test('the contact enquiry preserves entered details and requires consent before saving',async({page})=>{
  await page.route('https://*.supabase.co/**',route=>route.abort());await page.goto('/contact/');
  const form=page.locator('[data-contact-form]');await form.getByLabel('Full Name',{exact:true}).fill('Contact Traveller');
  await form.getByLabel('Phone Number',{exact:true}).fill('+971500000000');await form.getByLabel('Destination / Package Interested',{exact:true}).fill('Japan');
  await form.getByLabel('Message',{exact:true}).fill('April, two travellers.');await form.getByRole('button',{name:'Continue Enquiry',exact:true}).click();
  const dialog=page.getByRole('dialog');await expect(dialog.getByLabel('Your name',{exact:true})).toHaveValue('Contact Traveller');
  await expect(dialog.getByLabel('Destination or package',{exact:true})).toHaveValue('Japan');
  await expect(dialog.getByLabel('Your message',{exact:true})).toHaveValue(/April, two travellers/);
  await expect(dialog.getByRole('checkbox')).not.toBeChecked();await expect(dialog.getByText('Your enquiry is saved.',{exact:true})).not.toBeVisible();
});
