w.Components = {};

w.utils = {
  updateDOM: function( fn, ctx ) {
		var methodFn = _.defer;
		if(typeof w.requestAnimationFrame == 'function') {
			methodFn = w.requestAnimationFrame;
		}

		if(!ctx) {
			return methodFn( fn );
		} else {
			return methodFn( _.bind(fn, ctx) );
		}
	},
  scrollTop: function(_val, _animate, _time_ms, cb) {
		var animate = (typeof _animate != 'undefined') ? _animate : true;
		var val = parseInt(_val);

		if(animate == false) {
			w.utils.updateDOM( function() {
				w.scrollTo(0, val);
			});
		} else {
			//with animation
			var from = w.pageYOffset;
			var by = _val - from;
      var time = parseInt(_time_ms) / 1000;

			var currentIteration = 0;

			/**
			 * get total iterations
			 * 60 -> requestAnimationFrame 60/second
			 * second parameter -> time in seconds for the animation
			 **/
			var animIterations = Math.round(60 * time);

			(function scroll() {
				var value = w.utils.easeInCubic(currentIteration, from, by, animIterations);
				w.scrollTo(0, value);
				currentIteration++;
				if (currentIteration < animIterations) {
					requestAnimationFrame(scroll);
				} else if(typeof cb == 'function') {
					cb();
				}
			})();
		}
	},
	easeOutCubic: function(currentIteration, startValue, changeInValue, totalIterations) {
		return changeInValue * (Math.pow(currentIteration / totalIterations - 1, 3) + 1) + startValue;
	},
  easeInCubic: function(currentIteration, startValue, changeInValue, totalIterations) {
  	return changeInValue * Math.pow(currentIteration / totalIterations, 3) + startValue;
  },
  filterSubstr( _str, arr ) {
    var str = _str.trim().toLowerCase();
    var result = [];
    arr.forEach(function(_elem) {
      var elem = _elem.toLowerCase();
      if(elem.indexOf(str) != -1) {
        result.push(_elem);
      }
    });

    result.sort(function(a, b) {
      return (a.toLowerCase().indexOf(str) - b.toLowerCase().indexOf(str));
    });

    return result;
	},

	_fakeLoad: function(elem, ctx, fn) {
		if(!elem || !elem.classList) {
			return;
		}

		var loadingT = Math.round( Math.random() * 1500 ) + 500;
		elem.classList.add('loading');
		
		console.log('!!', loadingT);

		setTimeout(function() {
			w.requestAnimationFrame(function() { elem.classList.remove('loading')} );
			fn.apply(ctx);
		}, loadingT);
	},

	toggleLoad: function(elem, on = true) {
		if(!elem || !elem.classList) {
			console.dir(elem);
			console.trace();
			return;
		}
		
		elem.classList.toggle('loading', on);
	},

	// @TODO: add Promise polyfill
	ajax: function(opts) {
		var data = opts.data || null;
		var method = typeof opts.method !== 'undefined' ? opts.method : 'GET';
		var url = opts.url;

		if (!url) return new Promise(function(resolve,reject){reject(Error('No URL provided'))});

		var query = [];
		if (data != null && typeof data == 'object') {
			for (var key in data) {
				if (!data.hasOwnProperty(key)) continue;
				query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
			}
			data = query.join('&');

			if ('' == data) data = null;
		}

		// console.log(data);

		return new Promise(function(resolve, reject) {
			// Do the usual XHR stuff
			var req = new XMLHttpRequest();

			if (method == 'POST') {
				req.open(method, url);
			} else {
				req.open(method, url+'?'+data);
			}
			// console.log(url+'?'+data);

			if (method == 'POST') req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			req.setRequestHeader("X-Requested-With", "XMLHttpRequest");

			req.onload = function() {
				// This is called even on 404 etc
				// so check the status
				if (req.status == 200) {
					// Resolve the promise with the response text
					resolve(req.response);
				}
				else {
					// Otherwise reject with the status text
					// which will hopefully be a meaningful error
					reject(Error(req.statusText));
				}
			};

			// Handle network errors
			req.onerror = function() {
				reject(Error("Network Error"));
			};

			// Make the request
			if (method == 'POST' && data) {
				req.send(data);
			} else {
				req. send();
			}

		})
	}
}

w._he = ["Vasile Goldis Western University, Арад, Румыния","Азербайджанский медицинский университет (АМУ), Баку","Азербайджанский международный университет, медицинский факультет, Баку","Алтайский государственный медицинский университет (АГМУ, АГМИ), Барнаул","Амурская государственная медицинская академия (АГМА, БГМИ), Благовещенск","Андижанский государственный медицинский институт (АГМИ), Андижан","Армянский медицинский институт (АМИ), Ереван","Армянско-Российский международный университет \"Мхитар Гош\", Ванадзор","Астраханская государственная медицинская академия (АГМА, АГМИ), Астрахань","Афинский Национальный Каподистрийский Университет, Афины, Греция","Балтийский федеральный университет им. Иммануила Канта, медицинский факультет (БФУ, РГУ), Калининград","Башкирский государственный медицинский университет (БГМУ, БГМИ), Уфа","Белгородский государственный университет, медицинский факультет (БелГУ), Белгород","Белорусский государственный медицинский университет (БГМУ, БМИ, ММИ), Минск","Буковинский государственный медицинский университет (БГМУ, БГМА), Черновцы","Бурятский государственный университет, медицинский факультет (БГУ), Улан-Удэ","Бухарский медицинский институт, Бухара","Вильнюсский университет, медицинский факультет (ВУ, ВГУ), Вильнюс","Винницкий национальный медицинский университет им. Н.И. Пирогова (ВНМУ), Винница","Витебский государственный медицинский университет (ВГМУ, ВГМИ), Витебск","Владивостокский государственный медицинский университет (ВГМУ, ВГМИ), Владивосток","Военно-медицинская академия Бундесвера, Росток","Военно-медицинская академия им. С.М. Кирова (ВМедА, ВМОЛКА, ВМА), Санкт-Петербург","Волгоградский государственный медицинский университет (ВолГМУ), Волгоград","Воронежская государственная медицинская академия им. Н.Н. Бурденко (ВГМА, ВГМИ), Воронеж","Гомельский государственный медицинский университет (ГГМУ, ГГМИ), Гомель","Государственная классическая академия им. Маймонида, факультет социальной медицины (ГКА, ГЕА), Москва","Государственный медицинский университет города Семей (ГМУ города Семей, СГМА, СГМИ), Семипалатинск","Государственный медицинский университет туркменистана (ТГМУ, ТГМИ), Ашхабад","Государственный университет медицины и фармакологии им. Николая Тестемицяну, Кишинёв","Гродненский государственный медицинский университет (ГрГМУ, ГрМАГрМИ), Гродно","Гюмрийский университет \"Прогресс\", Гюмри","Дагестанская государственная медицинская академия (ДГМА, ДГМИ), Махачкала","Дальневосточный государственный медицинский университет (ДВГМУ, ХГМИ), Хабаровск","Днепропетровская государственная медицинская академия  (ДГМА), Днепропетровск","Днепропетровский медицинский институт народной медицины, Днепропетровск","Днепропетровский национальный университет, факультет биологии, экологии и медицины (ДНУ), Днепропетровск","Донецкий государственный медицинский университет им. М. Горького (ДонНМУ), Донецк","Ереванский государственный медицинский университет им. М. Гераци (ЕГМУ), Ереван","Ереванский медицинский институт им. Меграбяна, Ереван","Ереванский медицинский университет им. Святой Терезы, Ереван","Ереванский университет \"Айбусак\", медицинский факультет, Ереван","Западно-Казахстанская государственная медицинская академия им. М. Оспанова (ЗКГМА, АГМА), Актобе","Запорожский государственный медицинский университет (ЗГМУ), Запорожье","Ивановская государственная медицинская академия (ИвГМА, ИГМА), Иваново","Ивано-Франковский государственный медицинский университет (ИФГМУ, ИФГМА, СГМИ), Ивано-Франковск","Ижевская государственная медицинская академия (ИГМА, ИГМИ), Ижевск","Ингушский государственный университет, медицинский факультет (ИнгГУ), Назрань","Институт экологии и медицины, медицинский факультет, Киев","Иркутский государственный медицинский университет (ИГМУ, ИГМИ), Иркутск","Кабардино-Балкарский государственный университет им. Х.М. Бербекова, медицинский факультет (КБГУ), Нальчик","Казанская государственная медицинская академия (КГМА, КГИДУВ), Казань","Казанский государственный медицинский университет (КГМУ, КГМИ), Казань","Казахский национальный медицинский университет им. С.Д. Асфендиярова (КазНМУ), Алма-Ата","Казахстанско-Российский медицинский университет (КРМУ, КМУ, КМИ), Алма-Ата","Карагандинский государственный медицинский университет (КГМУ, КГМА, КГМИ), Караганда","Кемеровская государственная медицинская академия (КемГМА, КемГМИ), Кемерово","Киевский медицинский университет Украинской ассоциации народной медицины (КМУ УАНМ), Киев","Кировская государственная медицинская академия (КГМА, КГМИ), Киров","Кишиневский государственный медицинский университет им. Н.Тестемицану","Красноярский государственный медицинский университет им. проф. В.Ф. Войно-Ясенецкого (КрасГМУ, КрасГМИ, КрасГМА), Красноярск","Крымский государственный медицинский университет им. С.И. Георгиевского (КГМУ, КГМИ), Симферополь","Кубанский государственный медицинский университет (КубГМУ, КубГМА, КубГМИ), Краснодар","Курский государственный медицинский университет (КГМУ, КГМИ), Курск","Кыргызская государственная медицинская академия (КГМА, КГМИ), Бишкек","Кыргызско-Российский славянский университет, медицинский факультет, Бишкек","Латвийский университет, медицинский факультет, Рига","Литовский университет наук о здоровье, медицинская академия, Каунас","Луганский государственный медицинский университет (ЛГМУ, ЛГМИ), Луганск","Львовский национальный медицинский университет им. Данила Галицкого (ЛМИ, ЛНМУ, ЛГМУ, ЛГМИ), Львов","Майкопский государственный технологический университет, медицинский институт (МИ МГТУ), Майкоп","Медицинский институт \"Амирдовлат Амасиаци\", Ванадзор","Медицинский университет Астана (AMU, МУА, КГМА, КМА, КазГМА), Астана","Международный казахско-турецкий университет им. Х.А. Яссави, школа медицины (МКТУ), Туркестан","Мордовский государственный университет им. Н.П. Огарева, медицинский институт (НИ МГУ), Саранск","Московский государственный медико-стоматологический университет (МГМСУ, МГМСИ), Москва","Московский государственный университет им. М.В. Ломоносова, факультет фундаментальной медицины (МГУ), Москва","Мюнхенский университет Людвига-Максимилиана","Нахичеванский государственный университет, медицинский факультет (НГУ), Нахичевань","Национальный медицинский университет им. А.А. Богомольца (НМУ), Киев","Нижегородская государственная медицинская академия (НижГМА, ГМИ), Нижний Новгород","Нижегородский военно-медицинский институт ФПС РФ  при НГМА (НижВМИ), Нижний Новгород","Новгородский государственный университет им. Ярослава Мудрого, институт медицинского образования (ИМО НовГУ), Новгород","Новосибирский государственный медицинский университет (НГМУ, НГМА, НМИ), Новосибирск","Новосибирский государственный университет, медицинский факультет (НГУ), Новосибирск","Обнинский институт атомной энергетики, медицинский факультет (ИАТЭ НИЯУ МИФИ), Обнинск","Одесский национальный медицинский университет (ОНМедУ, ОГМУ), Одесса","Омская государственная медицинская академия (ОмГМА, ОмГМИ), Омск","Оренбургская государственная медицинская академия (ОрГМА, ОрГМИ), Оренбург","Орловский государственный университет, медицинский институт (ОГУ), Орёл","Ошский государственный университет, медицинский институт (ОшГУ), Ош","Пензенский государственный унтверситет, медицинский институт (ПГУ), Пенза","Первый московский государственный медицинский университет им. И.М. Сеченова (1-й МГМУ, ММА), Москва","Первый Санкт-Петербургский государственный медицинский университет им. акад. И.П. Павлова (ПСПбГМУ, СПбГМУ, 1-й ЛМИ), Санкт-Петербург","Пермская государственная медицинская академия им. акад. Е.А. Вагнера (ПГМА, ПМИ), Пермь","Петрозаводский государственный университет, медицинский факультет (ПетрГУ), Петрозаводск","Приднестровский государственный университет им. Т.Г. Шевченко, медицинский факультет (ПГУ), Тирасполь","Рижский университет им. П. Страдиньша, медицинские факультеты, Рига","Российский национальный исследовательский медицинский университет им. Н.И. Пирогова (РНИМУ, РГМУ,  2-й МОЛГМИ), Москва","Российский университет дружбы народов, медицинский факультет (РУДН), Москва","Российско-Армянский государственный университет, медико-биологический факультет, Ереван","Ростовский государственный медицинский университет (РостГМУ, РостМИ), Ростов-на-Дону","Рязанский государственный медицинский университет им. акад. И.П. Павлова (РГМУ, РМИ), Рязань","Самаркандский государственный медицинский институт  (СамГосМИ), Самарканд","Самарский военно-медицинский институт (СВМИ), Самара","Самарский государственный медицинский университет (СамГМУ, КМИ), Самара","Самарский медицинский институт РЕАВИЗ (СМИ Реавиз), Самара","Санкт-Петербургский государственный педиатрический университет (СПбГПУ, СПбГПМА, ЛПМИ), Санкт-Петербург","Санкт-Петербургский государственный университет, медицинский факультет (СПбГУ, ЛГУ), Санкт-Петербург","Санкт-Петербургский медико-технический институт (СпбМТИ), Санкт-Петербург","Санкт-Петербургский терапевтический институт (СТИ), Санкт-Петербург","Саратовский военно-медицинский институт (СВМИ), Саратов","Саратовский государственный медицинский университет им. В.И. Разумовского (СГМУ, СМИ), Саратов","Северный государственный медицинский университет (СГМУ, АГМА, АГМИ), Архангельск","Северо-восточный федеральный университет им. М.К. Аммосова, медицинский институт (СВФУ, ЯГУ), Якутск","Северо-Западный государственный медицинский университет им. И.И.Мечникова (СЗГМУ, СПбГМА, ЛСГМИ), Санкт-Петербург","Северо-Кавказская государственная гуманитарно-технологическая академия (КЧТИ, КЧГТА, СКГГТА), Черкесск","Северо-Осетинская государственная медицинская академия (СОГМА, СОГМИ), Владикавказ","Сибирский государственный медицинский университет (СГМУ, ТМИ), Томск","Смоленская государственная медицинская академия (СГМА, СГМИ), Смоленск","Ставропольская государственная медицинская академия (СтГМА, СГМИ), Ставрополь","Сумской государственный университет, медицинский институт (СумГУ), Сумы","Сургутский государственный университет, лечебный факультет (СурГУ), Сургут","Таджикский государственный медицинский университет им. Абуали ибн Сино (ТГМУ ТГМИ), Душанбе","Тамбовский государственный университет имени Г.Р. Державина, медицинский институт (ТГУ), Тамбов","Тамбовский государственный университет имени Г.Р. Державина, медицинский институт (ТГУ), Тамбов","Тамбовский государственный университет имени Г.Р. Державина, медицинский институт (ТГУ), Тамбов","Тартуский университет, медицинский факультет, Тарту","Ташкентская медицинская академия (ТашМА, ТашМИ, 1-й ТашМИ, 2-й ТашМИ), Ташкент","Ташкентский педиатрический медицинский институт (ТашПМИ, САМПИ), Ташкент","Тбилисский государственный медицинский университет (ТГМУ), Тбилиси","Тбилисский государственный университет им. Иванэ Джавахишвили, медицинский факультет (ТГУ), Тбилиси","Тверская государственная медицинская академия (ТГМА), Тверь","Тернопольский государственный медицинский университет им. И.Я. Горбачевского (ТГМУ, ТГМА), Тернополь","Томский военно-медицинский институт (ТВМИ), Томск","Тульский государственный университет, медицинский институт (ТулГУ), Тула","Тюменская государственная медицинская академия (ТГМА,ТГМИ), Тюмень","Ужгородский национальный университет, медицинский факультет (УжНУ), Ужгород","Украинская медицинская стоматологическая академия (УМСА), Полтава","Ульяновский государственный университет, медицинский факультет (УлГУ), Ульяновск","Университет Хазар, школа медицины, стоматологии и здравоохранения, Баку","Уральский государственный медицинский университет (УГМУ, УГМА, СГМИ), Екатеринбург","Хакасский государственный университет им. Н.Ф.Катанова, медико-психолого-социальный институт (ХГУ), Абакан","Ханты-Мансийская государственная медицинская академия (ХГМА, ХГМА), Ханты-Мансийск","Харьковский национальный медицинский университет (ХНМУ), Харьков","Харьковский национальный университет им. В.Н. Каразина, медицинский факультет, Харьков","Чеченский государственный университет, медицинский факультет (ЧГУ, ЧИГУ), Грозный","Читинская государственная медицинская академия (ЧГМА, ЧГМИ), Чита","Чувашский государственный университет, медицинский факультет (ЧувГУ), Чебоксары","Южно-Казахстанская государственная фармацевтическая академия (ЮКГФА, ЮКГМА), Шымкент","Южно-Уральский государственный медицинский университет (ЮУГМУ, ЧелГМА, ЧелГМИ), Челябинск","Ярославская государственная медицинская академия (ЯГМА, ЯГМИ), Ярославль"]
