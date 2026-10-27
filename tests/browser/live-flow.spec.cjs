const {test,expect}=require('@playwright/test');
const {createClient}=require('@supabase/supabase-js');

test('real Supabase customer → staff → customer flow, refresh and visitor isolation',async({browser,baseURL})=>{
  test.skip(!process.env.CHAT_TEST_AGENT_EMAIL||!process.env.CHAT_TEST_AGENT_PASSWORD||!process.env.SUPABASE_URL||!process.env.SUPABASE_ANON_KEY,'Requires a migrated test Supabase project, anonymous Auth and an enabled test staff account.');
  const visitorContext=await browser.newContext(),agentContext=await browser.newContext();
  const customer=await visitorContext.newPage(),staff=await agentContext.newPage();
  const name=`Chat verification ${Date.now()}`,request=`Please help with Japan ${Date.now()}`,reply=`Happy to help ${Date.now()}`;
  const packageUrl=`${baseURL}/packages/japan-tokyo-osaka/`;
  try{
    const config=await staff.request.get(`${baseURL}/data/supabase-config.js`);
    expect(await config.text()).toContain(JSON.stringify(process.env.SUPABASE_URL));
    expect(await config.text()).toContain(JSON.stringify(process.env.SUPABASE_ANON_KEY));
    await staff.goto(`${baseURL}/admin/live-chat/`);
    await staff.getByLabel('Staff email',{exact:true}).fill(process.env.CHAT_TEST_AGENT_EMAIL);
    await staff.getByLabel('Password',{exact:true}).fill(process.env.CHAT_TEST_AGENT_PASSWORD);
    await staff.getByRole('button',{name:'Sign in to travel support',exact:true}).click();
    await expect(staff.locator('#workspace')).toBeVisible();await staff.getByLabel('Your availability').selectOption('online');
    await customer.goto(packageUrl);await customer.locator('#pricingGrid [data-flyo-chat]').first().click();
    const dialog=customer.getByRole('dialog');await dialog.getByLabel('Your name',{exact:true}).fill(name);
    await dialog.getByLabel('WhatsApp / mobile number',{exact:true}).fill('+971500000000');
    await dialog.getByLabel('Your message',{exact:true}).fill(request);await dialog.getByRole('checkbox').check();
    await dialog.getByRole('button',{name:'Send enquiry',exact:true}).click();await expect(dialog.getByText('Your enquiry is saved. Our travel team can reply here.',{exact:true})).toBeVisible();
    await staff.locator('#inbox-list').getByRole('button').filter({hasText:name}).click();
    await expect(staff.locator('#messages').getByText(request,{exact:true})).toBeVisible({timeout:7000});
    await staff.getByLabel('Reply to customer',{exact:true}).fill(reply);await staff.getByRole('button',{name:'Send reply',exact:true}).click();
    await expect(dialog.getByText(reply,{exact:true})).toBeVisible({timeout:7000});
    await customer.reload();await customer.getByRole('button',{name:/Open Flyo Travel Support/}).click();
    await customer.locator('#flyo-live-chat').getByRole('button',{name:'Chat with Our Team',exact:true}).click();
    await expect(customer.getByRole('dialog').getByText(reply,{exact:true})).toBeVisible();
    const otherVisitor=createClient(process.env.SUPABASE_URL,process.env.SUPABASE_ANON_KEY,{auth:{persistSession:false}});
    const {error:authError}=await otherVisitor.auth.signInAnonymously();expect(authError).toBeNull();
    const {data:otherMessages,error:readError}=await otherVisitor.from('flyo_messages').select('body').eq('body',request);expect(readError).toBeNull();expect(otherMessages).toEqual([]);
    await staff.getByLabel('Status',{exact:true}).selectOption('resolved');await expect(staff.locator('#ended')).toBeVisible();
    await staff.getByRole('button',{name:'Sign out',exact:true}).click();await expect(staff.locator('#workspace')).toBeHidden();
    await otherVisitor.auth.signOut();
  }finally{await visitorContext.close();await agentContext.close();}
});
