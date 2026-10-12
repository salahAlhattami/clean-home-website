const PHONE='966557002574';
const services=new Set(['تنظيف المنازل','تنظيف الكنب','تنظيف السجاد','تنظيف الخزانات','أكثر من خدمة']);
const serviceCatalog={
 home:{name:'تنظيف المنازل',image:'home-service',description:'عناية بمساحات منزلك، من الغرف إلى المطابخ والحمامات والأرضيات. نبدأ بفهم احتياج المكان وننسّق معك نطاق الخدمة.',points:['حدد الغرف والمساحات التي تحتاج التنظيف.','شاركنا المساحة التقريبية وحالة المكان.','ناقش معنا التفاصيل والسعر قبل تأكيد الموعد.'],note:'أرسل اسم الحي داخل مكة، وصورًا للمكان إن أمكن.',quantityLabel:'المساحة التقريبية',placeholder:'مثل 120 مترًا مربعًا أو 4 غرف'},
 sofa:{name:'تنظيف الكنب',image:'sofa-service',description:'عناية بتفاصيل الكنب والمفروشات، مع مراعاة نوع القماش وحالته. أخبرنا بالقطع التي تحتاج الاهتمام لنناقش الخدمة المناسبة.',points:['حدد عدد قطع الكنب أو المقاعد.','أخبرنا بنوع القماش إن كان معروفًا.','أرسل صورًا توضح الحالة ومواضع العناية.'],note:'طريقة التنظيف والسعر تُناقشان وفق الخامة والحالة.',quantityLabel:'عدد القطع أو المقاعد',placeholder:'مثل 5 قطع كنب أو مجلس من 8 مقاعد'},
 carpet:{name:'تنظيف السجاد',image:'carpet-service',description:'عناية بالسجاد والموكيت وفق مساحة القطعة ونوع الخامة وحالتها. التفاصيل التي ترسلها تساعد في توضيح احتياج الخدمة.',points:['حدد عدد القطع أو مساحة الموكيت.','شاركنا مقاس السجاد التقريبي.','وضح حالة السجاد وأي مواضع تحتاج اهتمامًا.'],note:'أرسل المقاسات أو الصور عند التواصل لتوضيح طلبك.',quantityLabel:'العدد أو المقاسات',placeholder:'مثل سجادتين، مقاس الواحدة 3×4 أمتار'},
 tank:{name:'تنظيف الخزانات',image:'tank-service',description:'خدمة تنظيف خزانات المياه، تُنسّق حسب نوع الخزان وحجمه وموقعه وطريقة الوصول إليه. شاركنا هذه التفاصيل لنناقش الطلب.',points:['أخبرنا إن كان الخزان أرضيًا أو علويًا.','شاركنا الحجم التقريبي إن كان معروفًا.','وضح الموقع وطريقة الوصول إلى الخزان.'],note:'يتم تأكيد متطلبات الخدمة بعد مناقشة تفاصيل الخزان.',quantityLabel:'نوع الخزان وحجمه',placeholder:'مثل خزان علوي، سعة 2000 لتر'}
};
const toolCatalog={daily:{image:'cleaning-tools',label:'أدوات العناية اليومية'},fabric:{image:'sofa-service',label:'العناية بالمفروشات'},tank:{image:'tank-service',label:'تجهيز تنظيف الخزانات'}};
function buildRequestMessage({name,service,neighborhood,details,quantity}){
 const lines=['مرحبًا كلين هوم، أرغب في طلب عرض سعر.',''];
 if(name?.trim())lines.push(`الاسم: ${name.trim()}`);
 lines.push(`الخدمة: ${service.trim()}`,'المدينة: مكة المكرمة',`الحي: ${neighborhood.trim()}`);
 if(quantity?.trim())lines.push(`المساحة أو العدد / الحجم: ${quantity.trim()}`);
 if(details?.trim())lines.push(`التفاصيل: ${details.trim()}`);
 lines.push('','أرجو تزويدي بالسعر والمواعيد المتاحة.');return lines.join('\n');
}
if(typeof document!=='undefined'){
 const q=s=>document.querySelector(s),qa=s=>[...document.querySelectorAll(s)];
 const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
 const menuButton=q('.menu-toggle'),mobileNav=q('#mobile-nav');
 const closeMenu=()=>{mobileNav.hidden=true;menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','فتح قائمة التنقل');};
 menuButton.addEventListener('click',()=>{const open=mobileNav.hidden;mobileNav.hidden=!open;menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'إغلاق قائمة التنقل':'فتح قائمة التنقل');});
 qa('#mobile-nav a').forEach(a=>a.addEventListener('click',closeMenu));
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!mobileNav.hidden){closeMenu();menuButton.focus();}});
 window.matchMedia('(min-width: 901px)').addEventListener('change',e=>{if(e.matches)closeMenu();});
 window.addEventListener('scroll',()=>q('#site-header').classList.toggle('scrolled',window.scrollY>20),{passive:true});
 q('#year').textContent=new Date().getFullYear();
 const serviceSelect=q('#service'),neighborhood=q('#neighborhood'),quantityInput=q('#quantity'),form=q('#request-form'),dialogs=qa('dialog');
 function openDialog(dialog){if(typeof dialog.showModal!=='function')return false;dialog.showModal();document.body.classList.add('dialog-open');return true;}
 dialogs.forEach(dialog=>{
  dialog.addEventListener('close',()=>{if(!dialogs.some(d=>d.open))document.body.classList.remove('dialog-open');});
  dialog.addEventListener('click',e=>{if(e.target!==dialog)return;const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();});
  dialog.querySelector('[data-close-dialog]').addEventListener('click',()=>dialog.close());
 });
 function refreshRequest(){
  const selected=Object.values(serviceCatalog).find(s=>s.name===serviceSelect.value);
  q('#quantity-label').replaceChildren(document.createTextNode(`${selected?.quantityLabel||'المساحة أو العدد'} `));
  const optional=document.createElement('span');optional.textContent='(اختياري)';q('#quantity-label').append(optional);
  quantityInput.placeholder=selected?.placeholder||'المساحة التقريبية أو عدد القطع';
  q('#request-summary').textContent=[serviceSelect.value,neighborhood.value.trim()?`حي ${neighborhood.value.trim()} · مكة المكرمة`:''].filter(Boolean).join(' — ')||'اختر الخدمة وأضف الحي لتجهيز طلبك.';
 }
 serviceSelect.addEventListener('change',refreshRequest);
 neighborhood.addEventListener('input',()=>{neighborhood.setCustomValidity('');refreshRequest();});
 qa('[data-service]').forEach(a=>a.addEventListener('click',()=>{if(services.has(a.dataset.service)){serviceSelect.value=a.dataset.service;refreshRequest();}}));
 const serviceDialog=q('#service-dialog');
 qa('[data-service-open]').forEach(a=>a.addEventListener('click',e=>{
  const data=serviceCatalog[a.dataset.serviceOpen];if(!data)return;
  serviceSelect.value=data.name;refreshRequest();
  q('#dialog-service-title').textContent=data.name;q('#dialog-service-description').textContent=data.description;q('#dialog-service-note').textContent=data.note;
  q('#dialog-service-image').src=`assets/${data.image}.webp`;q('#dialog-service-image').alt=`صورة توضيحية لخدمة ${data.name}`;
  q('#dialog-service-points').replaceChildren(...data.points.map(text=>{
   const li=document.createElement('li'),check=document.createElementNS('http://www.w3.org/2000/svg','svg'),use=document.createElementNS('http://www.w3.org/2000/svg','use');
   check.classList.add('icon');check.setAttribute('aria-hidden','true');use.setAttribute('href','#i-check');check.append(use);li.append(check,document.createTextNode(text));return li;
  }));
  if(openDialog(serviceDialog))e.preventDefault();
 }));
 q('#dialog-service-request').addEventListener('click',()=>{serviceDialog.close();q('#request-title').focus({preventScroll:true});});
 qa('[data-gallery]').forEach(button=>button.addEventListener('click',()=>{q('#gallery-image').src=button.dataset.gallery;q('#gallery-image').alt=button.dataset.caption;q('#gallery-caption').textContent=button.dataset.caption;openDialog(q('#gallery-dialog'));}));
 qa('[data-tool]').forEach(button=>button.addEventListener('click',()=>{
  const data=toolCatalog[button.dataset.tool];if(!data)return;
  qa('[data-tool]').forEach(toggle=>{const active=toggle===button;toggle.setAttribute('aria-expanded',String(active));q(`#${toggle.getAttribute('aria-controls')}`).hidden=!active;});
  const image=q('#tools-image');image.src=`assets/${data.image}.webp`;image.alt=`${data.label} — صورة توضيحية`;q('#tools-image-label').textContent=data.label;
  const gallery=image.closest('[data-gallery]');gallery.dataset.gallery=image.src;gallery.dataset.caption=`${data.label} — صورة توضيحية`;gallery.setAttribute('aria-label',`تكبير صورة ${data.label}`);
 }));
 q('#quick-form').addEventListener('submit',e=>{
  e.preventDefault();const quickForm=e.currentTarget,data=Object.fromEntries(new FormData(quickForm).entries()),input=q('#quick-neighborhood');
  input.setCustomValidity(data.neighborhood?.trim()?'':'يرجى كتابة اسم الحي.');if(!quickForm.reportValidity()||!services.has(data.service))return;
  serviceSelect.value=data.service;neighborhood.value=data.neighborhood.trim();neighborhood.setCustomValidity('');refreshRequest();closeMenu();
  q('#request').scrollIntoView({behavior:reducedMotion.matches?'auto':'smooth',block:'start'});q('#request-title').focus({preventScroll:true});
 });
 q('#quick-neighborhood').addEventListener('input',()=>q('#quick-neighborhood').setCustomValidity(''));
 form.addEventListener('submit',e=>{
  e.preventDefault();const data=Object.fromEntries(new FormData(form).entries());neighborhood.setCustomValidity(data.neighborhood?.trim()?'':'يرجى كتابة اسم الحي داخل مكة المكرمة.');
  if(!form.reportValidity()||!services.has(data.service))return;
  const url=`https://wa.me/${PHONE}?text=${encodeURIComponent(buildRequestMessage(data))}`;window.open(url,'_blank','noopener,noreferrer');
  const feedback=q('#form-feedback');feedback.replaceChildren(document.createTextNode('طلبك جاهز. '));
  const link=document.createElement('a');link.href=url;link.target='_blank';link.rel='noopener noreferrer';link.textContent='اضغط هنا لفتحه في واتساب';feedback.append(link);feedback.hidden=false;
 });
 if('IntersectionObserver' in window){
  if(!reducedMotion.matches){
   const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.remove('waiting');observer.unobserve(entry.target);}});},{threshold:.08});
   document.body.classList.add('motion-ready');qa('.reveal').forEach(el=>{el.classList.add('waiting');observer.observe(el);});
  }
  const navLinks=qa('.desktop-nav a'),navObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(!entry.isIntersecting)return;navLinks.forEach(a=>{const active=a.hash===`#${entry.target.id}`;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});});},{rootMargin:'-15% 0px -65% 0px',threshold:0});
  navLinks.forEach(a=>{const section=q(a.hash);if(section)navObserver.observe(section);});
 }
}
if(typeof module!=='undefined')module.exports={buildRequestMessage,PHONE,services,serviceCatalog,toolCatalog};
