// Source: the package brief supplied on 26 October 2026. Referenced original
// DOCX/PDF files were not attached. Missing commercial terms stay unconfirmed.
const image = name => `/packages/group-tour-images/${name}.webp`;
const day = (number, title, details, images = []) => ({ day: `Day ${number}`, title, text: details.join('. ') + '.', details, chips: [], images });
const option = (label, price, hotels, mealPlan, transferType, features, priceNote = 'per person') => ({label,price,hotels,mealPlan,transferType,features,priceNote,cta:'Enquire Now'});

export const groupPackages = [
  {
    slug: 'thailand-bangkok-pattaya-group-package',
    title: 'Thailand Holiday Special Group Package – Paradise Bangkok & Pattaya',
    country: 'Thailand', route: 'Bangkok & Pattaya, Thailand',
    duration: '4 Nights / 5 Days', availability: '28 November – 02 December 2026',
    category: 'Group Tour', packageType: 'Flight + Hotel + Transfers + Sightseeing',
    hotelCategory: '4 Star', price: 'AED 3699', priceNote: 'per person with Air Arabia',
    tags: ['Group Tour','Thailand','Bangkok','Pattaya'], recommendedMonths: ['November','December'],
    heroImage: image('thailand-bangkok'),cardImage:image('thailand-bangkok-card'),
    heroAlt: 'Illustrative sunset view of Wat Arun beside the Chao Phraya River in Bangkok',
    galleryImages: [
      {src:image('thailand-bangkok'),label:'Bangkok temples and river at sunset'},
      {src:'/packages/Thai_Wonder_WebP_Images/Thai_Wonder_Beach.webp',label:'Thailand beach and island scenery'},
      {src:'/packages/Thai_Wonder_WebP_Images/Thai_Wonder_Night.webp',label:'Thailand after dark'}
    ],
    imageHighlights: ['Bangkok temples','Pattaya & Coral Island','4-star hotels'],
    summary:'5D/4N Bangkok & Pattaya group holiday with flights, transfers and sightseeing.',
    overview:'A five-day group holiday in Bangkok and Pattaya from 28 November to 02 December 2026, combining four-star hotel accommodation, return airfare, private AC coach transfers and sightseeing. Visit Coral Island, Bangkok’s temples and Safari World, with meals as mentioned in the itinerary.',
    highlights:['Coral Island Tour with lunch','Alcazar Show – Standard Seat','Chao Phraya Princess Dinner Cruise','Pattaya Floating Market with rowing boat','Golden Buddha & Marble Buddha Temple Tour','Safari World & Marine Park with lunch'],
    itinerary:[
      day(1,'Arrival Bangkok & Pattaya',['Arrival Bangkok','Transfer to Pattaya','Check-in','Alcazar Show (Standard Seat)','Dinner at Indian restaurant','Overnight Pattaya'],[image('thailand-bangkok')]),
      day(2,'Coral Island & Pattaya',['Coral Island Tour','Lunch included','Pattaya Floating Market with rowing boat','Pattaya City Tour','Big Buddha','Pattaya View Point','Gems Gallery','Dinner','Overnight Pattaya'],['/packages/Thai_Wonder_WebP_Images/Thai_Wonder_Beach.webp']),
      day(3,'Bangkok Temples & Dinner Cruise',['Transfer from Pattaya to Bangkok','Bangkok Temple Tour','Wat Traimit (Golden Buddha)','Wat Benchamabophit (Marble Buddha)','Shopping time','Chao Phraya Princess Dinner Cruise','Lunch and dinner included','Overnight Bangkok'],[image('thailand-bangkok')]),
      day(4,'Safari World & Marine Park',['Safari World & Marine Park','Lunch included','Private transfers included','Overnight Bangkok']),
      day(5,'Departure',['Breakfast','Check-out','Transfer to Bangkok Airport','Departure'])
    ],
    pricingOptions:[
      option('Air Arabia — starting fare','AED 3699',['4-star hotel accommodation'],'Meals as mentioned','Private AC coach',['Return airfare with Air Arabia','Starting fare as quoted'],'per person; twin-share quotation below'),
      option('Air Arabia — twin share','AED 3899',['4-star hotel accommodation'],'Meals as mentioned','Private AC coach',['Twin Share: 25 Adults','Child with Bed: 2 Children — AED 3699'],'per adult, twin sharing'),
      option('Flydubai — twin share','AED 4579',['4-star hotel accommodation'],'Meals as mentioned','Private AC coach',['Twin Share: 25 Adults','Child with Bed: 2 Children — AED 4379'],'per adult, twin sharing')
    ],
    scheduleTitle:'Flight details',
    schedule:[
      {label:'Air Arabia · 28 Nov 2026',place:'Sharjah → Bangkok · G9 821 · Direct',departure:'22:05',arrival:'07:20 +1'},
      {label:'Air Arabia · 03 Dec 2026',place:'Bangkok → Sharjah · G9 817 · Direct',departure:'18:05',arrival:'22:05'},
      {label:'Flydubai · 28 Nov 2026',place:'Dubai (DXB) → Bangkok (DMK)',departure:'22:45',arrival:'07:55 (+1)'},
      {label:'Flydubai · 03 Dec 2026',place:'Bangkok (DMK) → Dubai (DXB)',departure:'23:00',arrival:'03:20 (+1)'}
    ],
    inclusions:['Return airfare','Travel insurance','All transfers and sightseeing by private AC coach','English-speaking guide throughout the trip','Meals as mentioned','Meals with 2 non-vegetarian items as specified','2 water bottles per person per day','National Park fees','Alcazar Show – Standard Seat','Coral Island Tour with lunch and private land transfer','Pattaya Floating Market + Rowing Boat','Pattaya City Tour','Big Buddha + Pattaya View Point + Gems Gallery','Golden Buddha & Marble Buddha Temple Tour','Shopping visit','Chao Phraya Princess Dinner Cruise – GIT','Safari World + Marine Park with lunch','4-star hotel accommodation','Indian restaurant meals as specified'],
    exclusions:['Personal expenses','Optional activities and water sports at Coral Island','Tips and gratuities','Meals/services not mentioned under inclusions','Increase in airfare, taxes, or government charges after quotation','Early check-in / late check-out','Services not mentioned in itinerary','Visa charges, if applicable'],
    importantInfo:[
      'Main travel dates: 28 November – 02 December 2026. The supplier flight details show return flights on 03 December 2026. Flight timings as per supplier quotation; please confirm the final travel schedule with Flyo before booking.',
      'The quoted Air Arabia starting fare is AED 3699 per person. The twin-share quotation separately lists AED 3899 per adult (25 adults) and AED 3699 for children with a bed (2 children). Contact us to confirm the applicable fare.',
      'Flydubai starts from AED 4579 per person; the twin-share quotation lists AED 4579 per adult (25 adults) and AED 4379 for children with a bed (2 children).'
    ],
    policySections:[{title:'Cancellation policy',items:['60–31 days before departure: 25%','30–21 days before departure: 50%','20–15 days before departure: 75%','14 days or less / no-show / early departure: 100%']}],
    faqs:[{question:'Which dates should I confirm before booking?',answer:'The main travel dates are 28 November – 02 December 2026, while the quoted return flights depart Bangkok on 03 December 2026. Contact Flyo to confirm the final schedule.'},{question:'What is the Air Arabia twin-sharing price?',answer:'The quotation lists AED 3899 per adult on twin sharing for 25 adults, alongside a separate starting fare of AED 3699 per person. Please confirm the applicable fare with Flyo.'}]
  },
  {
    slug:'japan-tokyo-osaka',title:'Japan Land Package – Tokyo & Osaka',
    country:'Japan',route:'Tokyo (4 Nights) / Osaka (3 Nights), Japan',duration:'7 Nights / 8 Days',
    availability:'Starts 03 April 2027',category:'Group Tour',packageType:'Land Package',
    hotelCategory:'4 Star',price:'AED 8511',priceNote:'per person, double sharing',
    tags:['Group Tour','Japan','Tokyo','Osaka'],recommendedMonths:['April'],
    heroImage:image('japan-fuji'),cardImage:image('japan-fuji-card'),heroAlt:'Illustrative Mount Fuji and Lake Ashi scenery in Hakone, Japan',
    galleryImages:[{src:image('japan-fuji'),label:'Mount Fuji & Hakone scenery'},{src:image('tokyo-city'),label:'Tokyo skyline & Asakusa'},{src:image('osaka-dotonbori'),label:'Dotonbori canal, Osaka'}],
    imageHighlights:['Tokyo & Osaka','Mt. Fuji & Hakone','Bullet train journey'],
    summary:'8D/7N Tokyo & Osaka land package with Mt. Fuji, bullet train and city tours.',
    overview:'An eight-day Japan land package starting 03 April 2027 for 30 adults (Trip ID: 4462000). Spend four nights in Tokyo and three in Osaka, with private guided tours, a Mount Fuji and Hakone excursion, an ordinary-class bullet train journey and sightseeing in Kyoto and Nara. Airfare is excluded.',
    highlights:['Tokyo city tours','Mt. Fuji & Hakone Tour','Lake Ashi Cruise & Hakone Ropeway','TeamLab Planets','Bullet train to Shin-Osaka','Kyoto & Nara day tour','Osaka walking tour'],
    itinerary:[
      day(1,'Arrival in Tokyo',['Narita airport transfer (private)','Travel insurance','eSIM unlimited data']),
      day(2,'Tokyo City Tour',['Tokyo day tour','Asakusa Sensoji Temple & Nakamise-dori','Tokyo Skytree','Imperial Palace photo stop','Shibuya Crossing'],[image('tokyo-city')]),
      day(3,'Mt. Fuji & Hakone',['Mt. Fuji & Hakone Tour','Lake Ashi Cruise','Hakone Ropeway','Owakudani Boiling Valley'],[image('japan-fuji')]),
      day(4,'Tokyo, Harajuku & TeamLab',['Tokyo day tour','Meiji Jingu Shrine','Harajuku & Takeshita Street','TeamLab Planets']),
      day(5,'Bullet Train to Osaka',['Tokyo hotel to station transfer','Bullet train to Shin-Osaka','Osaka hotel transfer','Osaka Castle photo stop']),
      day(6,'Kyoto & Nara',['Osaka / Kyoto / Nara day tour','Kinkaku-ji Temple','Fushimi Inari Taisha','Nara Park','Todai-ji Temple']),
      day(7,'Osaka Walking Tour',['Osaka walking tour','Kuromon Market','Umeda Sky Building / Floating Garden Observatory','Shinsaibashi & Dotonbori'],[image('osaka-dotonbori')]),
      day(8,'Departure from Osaka',['Osaka hotel to Kansai Airport transfer','Departure'])
    ],
    pricingOptions:[option('Japan land package','AED 8511',['Tokyo: East 21 Tokyo (4 Star) — 4 nights, Bed & Breakfast','Osaka: Moxy Osaka Honmachi (4 Star) — 3 nights, Bed & Breakfast'],'Daily breakfast; dinner × 7; lunch × 6','Private return airport transfers & station transfers',['30 Adults','Ordinary-class bullet train tickets as per itinerary','2 × 500 ml water per person per day'],'per person, double sharing')],
    inclusions:['Accommodation as per table (or similar category)','Daily breakfast','Private return airport transfers','All tours on private basis (guide included)','Bullet train tickets as per itinerary, ordinary class','eSIM with unlimited data','Entry tickets as mentioned','Travel insurance','Station transfers','Dinner × 7','Lunch × 6','Water bottle: 2 × 500 ml per person per day'],
    exclusions:['GST & TCS as applicable','Local bus and train tickets','Water bottle / meals / tips / gratuities not listed','Airfare / taxi service','Early check-in','ROE applicable as on payment date','Inter-city baggage transfer','Accommodation / city tax','Anything not specifically mentioned in the inclusions'],
    importantInfo:['Trip ID: 4462000. Group size: 30 adults. Start date: 03 April 2027.','Airfare is excluded. Flight details: Contact us for details.','ROE applicable as on payment date.'],
    policySections:[{title:'Terms & cancellation policy',items:['Details to be confirmed. Contact us for the full supplier terms and cancellation policy, including JPY / ROE conditions, before booking.']}],
    faqs:[{question:'Are flights included?',answer:'No. This is a land package; airfare / taxi service are excluded.'},{question:'What is the accommodation?',answer:'Four nights at East 21 Tokyo (4 Star) and three nights at Moxy Osaka Honmachi (4 Star), on a bed and breakfast basis, or similar category as specified in the inclusions.'}]
  },
  {
    slug:'scandinavian-wonders',title:'Scandinavian Wonders',country:'Scandinavia',
    route:'Finland, Estonia, Sweden, Norway & Denmark',duration:'9 Nights / 10 Days',availability:'Dates to be confirmed',
    category:'Group Tour',packageType:'Multi-country Tour',hotelCategory:'3 Star',price:'AED 11810',priceNote:'per person',
    tags:['Group Tour','Finland','Estonia','Sweden','Norway','Denmark'],recommendedMonths:[],
    heroImage:image('norway-fjord'),cardImage:image('norway-fjord-card'),heroAlt:'Illustrative Norwegian fjord scenery near Gudvangen with steep green mountains and waterside houses',
    galleryImages:[{src:image('norway-fjord'),label:'Norwegian fjord scenery'},{src:image('stockholm-city'),label:'Stockholm waterfront'},{src:image('helsinki-city'),label:'Helsinki waterfront'}],imageHighlights:['Five countries','Fjord & rail journey','Nordic capitals'],
    summary:'10D Nordic multi-country tour across Finland, Estonia, Sweden, Norway and Denmark.',
    overview:'A nine-night journey across Finland, Estonia, Sweden, Norway and Denmark, combining Nordic capitals with the Flåm Railway and a fjord cruise from Flåm to Gudvangen. The tour cost is AED 11,810 per person, with three-star hotel accommodation and breakfast. Flight details are TBA.',
    highlights:['Helsinki city sightseeing & Tallinn day excursion by ferry','Overnight cruise from Helsinki to Stockholm','Stockholm: City Hall, Vasa Museum & SkyView','Oslo: Fram Museum & Vigeland Park','Scenic journey through Karlstad & Geilo','Flåm Railway & Flåm–Gudvangen fjord cruise','Bergen & Fløibanen funicular','Copenhagen canal cruise & Tivoli Gardens'],
    itinerary:[
      day(1,'Arrival in Helsinki',['Arrival in Helsinki','Transfer to hotel','Dinner at Indian restaurant','Overnight Helsinki']),
      day(2,'Helsinki – Tallinn – Helsinki',['Ferry','Guided city tour','Shopping time','Lunch and dinner','Overnight Helsinki']),
      day(3,'Helsinki & Overnight Cruise',['Helsinki tour','Lunch','Overnight cruise to Stockholm','Dinner on cruise']),
      day(4,'Stockholm Sightseeing',['Stockholm sightseeing','City Hall','Vasa Museum','SkyView','Lunch and dinner','Overnight Stockholm'],[image('stockholm-city')]),
      day(5,'Stockholm – Karlstad – Oslo',['Photo stop at Lake Vänern','Lunch and dinner','Overnight Oslo']),
      day(6,'Oslo – Geilo',['Fram Museum','Vigeland Park','Lunch','Dinner at hotel','Overnight Geilo']),
      day(7,'Geilo – Flåm – Gudvangen – Bergen',['Scenic train journey','Fjord cruise','Lunch','Dinner','Overnight Bergen'],[image('norway-fjord')]),
      day(8,'Bergen – Copenhagen',['Bergen city tour','Fløibanen funicular','Flight to Copenhagen','Tivoli Gardens','Dinner','Overnight Copenhagen']),
      day(9,'Copenhagen Sightseeing',['Rosenborg Castle','Canal cruise','Shopping time','Lunch and dinner','Overnight Copenhagen']),
      day(10,'Departure',['Boxed breakfast','Airport transfer'])
    ],
    pricingOptions:[option('Scandinavian Wonders','AED 11810',['3-star hotel accommodation'],'Breakfast','Transfers and sightseeing as per itinerary',['Finland, Estonia, Sweden, Norway & Denmark','9 Nights / 10 Days','Flight details: TBA'])],
    inclusions:['3-star hotel accommodation with breakfast','Transfers and sightseeing as per itinerary','Full inclusion list: Contact us for details.'],
    exclusions:['Details to be confirmed. Contact us for the full exclusions.'],
    scheduleTitle:'Flight details',schedule:[{label:'Flight details: TBA',place:'Contact us for details. No flight timings have been confirmed.'}],
    importantInfo:['Travel dates: Details to be confirmed.','The itinerary includes a Bergen–Copenhagen flight. Flight details and fare inclusion must be confirmed with Flyo.'],
    policySections:[{title:'Payment policy',items:['Contact us for details.']},{title:'Terms & important notes',items:['Details to be confirmed. Please request the full supplier quotation and commercial terms before booking.']}],
    faqs:[{question:'Are flight details confirmed?',answer:'Flight details are TBA. Contact Flyo to confirm schedules and fare inclusion, including the Bergen–Copenhagen sector.'},{question:'Which countries are on this tour?',answer:'Finland, Estonia, Sweden, Norway and Denmark.'}]
  },
  {
    slug:'rovaniemi-helsinki-group-tour',title:'Rovaniemi & Helsinki Group Tour',country:'Finland',
    route:'Rovaniemi & Helsinki, Finland',duration:'4 Nights / 5 Days',availability:'28 Nov – 02 Dec',
    category:'Group Tour',packageType:'Winter Group Tour',price:'Price on request',
    tags:['Group Tour','Finland','Winter','Northern Lights'],recommendedMonths:['November','December'],
    heroImage:image('rovaniemi-winter'),cardImage:image('rovaniemi-winter-card'),heroAlt:'Illustrative snowy Lapland cabin and spruce forest under the Northern Lights near Rovaniemi',
    galleryImages:[{src:image('rovaniemi-winter'),label:'Lapland winter & Northern Lights inspiration'},{src:image('helsinki-city'),label:'Helsinki winter waterfront'}],imageHighlights:['Santa Claus Village','Northern Lights','Train to Helsinki'],
    summary:'5D winter group tour with Santa Claus Village and a Northern Lights experience.',
    overview:'A five-day winter group tour visiting Rovaniemi and Helsinki from 28 Nov to 02 Dec. The itinerary includes Santa Claus Village, a Northern Lights excursion, three hotel nights in Rovaniemi, an overnight train to Helsinki and a Porvoo excursion. The travel year and package selling price are to be confirmed. Northern Lights are not guaranteed.',
    highlights:['Santa Claus Village visit','Rovaniemi City Tour','Northern Lights excursion — sightings not guaranteed','Overnight train to Helsinki','Helsinki City Tour & Rock Church','Porvoo excursion'],
    itinerary:[
      day(1,'Arrival in Rovaniemi',['Arrival in Rovaniemi','Airport transfer','Santa Claus Village visit','Overnight Rovaniemi']),
      day(2,'Rovaniemi & Northern Lights',['Rovaniemi City Tour','Northern Lights Excursion'],[image('rovaniemi-winter')]),
      day(3,'Leisure & Optional Snow Activities',['Leisure day with optional snow activities']),
      day(4,'Overnight Train to Helsinki',['Check-out','Overnight train to Helsinki']),
      day(5,'Helsinki, Porvoo & Departure',['Helsinki City Tour','Rock Church','Porvoo excursion','Departure'],[image('helsinki-city')])
    ],
    pricingOptions:[option('Rovaniemi & Helsinki group tour','Price on request',['3 nights hotel accommodation in Rovaniemi — category to be confirmed','1 night overnight train to Helsinki'],'Daily breakfast','Airport transfers',['Return economy airfare','Santa Claus Village visit','Northern Lights tour','Rovaniemi & Helsinki sightseeing','Porvoo excursion'],'Contact us for price')],
    inclusions:['Return economy airfare','3 nights hotel accommodation in Rovaniemi','1 night overnight train to Helsinki','Daily breakfast','Airport transfers','Santa Claus Village visit','Northern Lights tour','Rovaniemi & Helsinki sightseeing','Porvoo excursion','Travel insurance'],
    exclusions:['Schengen visa fees','Lunches & dinners unless specified','Optional activities','Personal expenses','Tips & porterage','Excess baggage','Items not mentioned in inclusions'],
    optionalTours:['Optional snow activities on the leisure day. Contact us for details and prices.'],
    importantInfo:['Travel dates: 28 Nov – 02 Dec. Travel year: Details to be confirmed.','Package selling price: Price on request. The AED 3,000 booking deposit is not the package price.','Northern Lights are not guaranteed. Destination images are illustrative.'],
    policySections:[
      {title:'Payment policy',items:['AED 3,000 per person booking deposit','50% payment within 15 days of booking','Balance 45 days before departure','Full payment before ticket issuance']},
      {title:'Terms',items:['Rates subject to availability','Northern Lights not guaranteed','Visa approval subject to embassy decision','No refund for unused services','Itinerary may change due to operational reasons']}
    ],
    faqs:[{question:'Are Northern Lights guaranteed?',answer:'No. The Northern Lights excursion is included, but sightings are not guaranteed.'},{question:'What year and price apply?',answer:'The supplied dates are 28 Nov – 02 Dec without a stated year. The package selling price is not provided. Please contact Flyo to confirm both before booking.'}]
  }
].map(item=>({...item,sourceBrief:true,relatedSlugs:['thailand-bangkok-pattaya-group-package','japan-tokyo-osaka','scandinavian-wonders','rovaniemi-helsinki-group-tour'].filter(slug=>slug!==item.slug)}));
