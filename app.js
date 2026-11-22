'use strict';
const videos = window.PORTFOLIO_VIDEOS;
const galleries = window.PORTFOLIO_GALLERIES;
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const number = n => n.toLocaleString('zh-CN',{maximumFractionDigits:2});
const escapeHTML = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const imageDialog = $('#image-dialog');
const videoDialog = $('#video-dialog');
let galleryName = 'design', galleryIndex = 0, dialogTrigger = null;
function openDialog(dialog, trigger){dialogTrigger=trigger;dialog.showModal();document.body.classList.add('locked');}
function closeDialog(dialog){dialog.close();document.body.classList.remove('locked');if(dialogTrigger)dialogTrigger.focus({preventScroll:true});}
$$('[data-close]').forEach(b=>b.addEventListener('click',()=>closeDialog(b.closest('dialog'))));
$$('dialog').forEach(d=>{d.addEventListener('cancel',e=>{e.preventDefault();closeDialog(d)});d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeDialog(d);}})});
function renderImage(){const group=galleries[galleryName],item=group[galleryIndex];$('#image-title').textContent=item.title;$('#large-image').src=item.src;$('#large-image').alt=item.title;$('#large-image').title=item.caption;$('#image-position').textContent=(galleryIndex+1)+' / '+group.length;$('#image-prev').disabled=galleryIndex===0;$('#image-next').disabled=galleryIndex===group.length-1;$('#image-body').classList.remove('zoomed');$('#image-body').scrollTop=0;$('#image-zoom').textContent='放大细节';}
$$('[data-gallery]').forEach(b=>b.addEventListener('click',()=>{galleryName=b.dataset.gallery;galleryIndex=Number(b.dataset.index||0);renderImage();openDialog(imageDialog,b)}));
function nextImage(delta){galleryIndex=Math.max(0,Math.min(galleries[galleryName].length-1,galleryIndex+delta));renderImage();}
$('#image-prev').addEventListener('click',()=>nextImage(-1));$('#image-next').addEventListener('click',()=>nextImage(1));
function zoomImage(){const zoomed=$('#image-body').classList.toggle('zoomed');$('#image-zoom').textContent=zoomed?'适应窗口':'放大细节';}
$('#image-zoom').addEventListener('click',zoomImage);$('#large-image').addEventListener('click',zoomImage);
imageDialog.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();nextImage(1)}if(e.key==='ArrowLeft'){e.preventDefault();nextImage(-1)}});
const sceneCaptions=['进入故事：以年代感视觉与标题建立阅读氛围。','宴会与物件：通过场景细节，邀请读者进入故事。','人物视角：以第一人称叙述串联情节与情绪。','文学导读：通过问题引导读者继续探索原著。','交互选择：让读者通过操作参与叙事。'];
$$('[data-scene]').forEach(b=>b.addEventListener('click',()=>{const i=Number(b.dataset.scene);[['#scene-left',(i+4)%5],['#scene-main',i],['#scene-right',(i+1)%5]].forEach(([s,n])=>{const item=galleries.gatsby[n];$(s).src=item.src;$(s).alt=item.title});$('.phone-stage').dataset.index=i;$('#scene-caption').textContent=sceneCaptions[i]+' 此处为原作画面预览。';$$('[data-scene]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)))}));
$$('[data-filter]').forEach(b=>b.addEventListener('click',()=>{$$('[data-filter]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));$$('.design-card').forEach(card=>{card.hidden=b.dataset.filter!=='all'&&card.dataset.category!==b.dataset.filter;})}));
const reasons={26:'表内播放量最高。以军训与求雨的校园热点为切入点，适合展示热点内容的剪辑与传播表现。',2:'表内播放量第二。美食题材贴近日常消费，补充地方饮食内容的剪辑表达。',35:'表内播放量第三。通过外来游客对贵阳的观察，呈现城市形象类内容。',19:'音乐热点代表。围绕周深贵阳演唱会倒计时组织内容，展示节点型话题的剪辑表达。',3:'原创采访代表。原表明确记录“采访、剪辑”，用于呈现除二创剪辑之外的采访与内容制作经历。'};
function showVideo(id,trigger){const v=videos.find(v=>v.id===Number(id));if(!v)return;$('#video-title').textContent=v.title;$('#video-role').textContent=v.kind+' · 我的工作：'+v.role;$('#video-views').textContent=number(v.views)+' 万';$('#video-interactions').textContent=number(v.interactions);$('#video-reason').textContent=reasons[v.id]||'该作品收录于 Hi 贵州实习成果表，可通过下方链接访问原发布内容。';$('#video-open').href=v.url;$('#video-open').textContent='前往'+(v.url.includes('kuaishou')?'快手':'抖音')+'观看';openDialog(videoDialog,trigger);}
$$('[data-video]').forEach(b=>b.addEventListener('click',()=>showVideo(b.dataset.video,b)));
function rank(metric){const top=[...videos].sort((a,b)=>b[metric]-a[metric]).slice(0,5);$('#ranking').innerHTML=top.map(v=>`<button class="rank-row" data-rank-video="${v.id}" aria-label="${escapeHTML(v.title)}，${metric==='views'?'播放量'+number(v.views)+'万':'互动量'+number(v.interactions)}，查看作品"><span>${escapeHTML(v.title)}</span><span class="bar-track" aria-hidden="true"><span class="bar" style="width:${v[metric]/top[0][metric]*100}%"></span></span><span class="amount">${number(v[metric])}${metric==='views'?' 万':''}</span></button>`).join('');$$('[data-rank-video]').forEach(b=>b.addEventListener('click',()=>showVideo(b.dataset.rankVideo,b)));}
$$('[data-rank]').forEach(b=>b.addEventListener('click',()=>{$$('[data-rank]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));rank(b.dataset.rank)}));rank('views');
function renderVideos(){const q=$('#video-search').value.trim().toLowerCase(),kind=$('#video-kind').value,sort=$('#video-sort').value;const list=videos.filter(v=>(kind==='all'||v.kind===kind)&&(!q||(v.title+' '+v.role+' '+v.kind).toLowerCase().includes(q))).sort((a,b)=>sort==='id'?a.id-b.id:b[sort]-a[sort]);$('#result-count').textContent=`显示 ${list.length} / ${videos.length} 条作品`;$('#video-rows').innerHTML=list.length?list.map(v=>`<tr><td>${escapeHTML(v.title)}</td><td>${escapeHTML(v.kind)}<br>${escapeHTML(v.role)}</td><td class="num">${number(v.views)}</td><td class="num">${number(v.interactions)}</td><td><a href="${escapeHTML(v.url)}" target="_blank" rel="noopener noreferrer" aria-label="在${v.url.includes('kuaishou')?'快手':'抖音'}观看：${escapeHTML(v.title)}">${v.url.includes('kuaishou')?'快手':'抖音'}</a></td></tr>`).join(''):'<tr><td colspan="5">没有匹配的作品，请尝试其他关键词或清除筛选。</td></tr>';}
$('#video-search').addEventListener('input',renderVideos);$('#video-kind').addEventListener('change',renderVideos);$('#video-sort').addEventListener('change',renderVideos);renderVideos();
const rail=$('#photo-rail');const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
$('#photo-prev').addEventListener('click',()=>rail.scrollBy({left:-rail.clientWidth*.85,behavior:reduced?'instant':'smooth'}));$('#photo-next').addEventListener('click',()=>rail.scrollBy({left:rail.clientWidth*.85,behavior:reduced?'instant':'smooth'}));
let ticking=false;function updateProgress(){const total=document.documentElement.scrollHeight-innerHeight;$('.scroll-progress').style.width=(total>0?scrollY/total*100:0)+'%';const sections=$$('section[id]').filter(s=>['concept','visual','practice','photography','about'].includes(s.id));let current=sections[0]?.id;for(const s of sections)if(s.getBoundingClientRect().top<innerHeight*.38)current=s.id;$$('.index a').forEach(a=>a.setAttribute('aria-current',String(a.hash==='#'+current)));ticking=false;}
addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(updateProgress)}},{passive:true});updateProgress();
if(!reduced&&'IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('reveal');observer.unobserve(e.target)}}),{threshold:.08});$$('.case,.feature-design,.hi-grid').forEach(el=>observer.observe(el));}

// Reveal imagery once; keep all content available with reduced motion or no JS.
if(!reduced&&'IntersectionObserver' in window){
 const imageObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('image-reveal');imageObserver.unobserve(entry.target)}}),{threshold:.12});
 $$('.design-card,.photo-tile').forEach((el,i)=>{el.style.setProperty('--delay',(i%3)*60+'ms');imageObserver.observe(el)});
}
function measurePosters(){ $$('.design-card.long .thumb').forEach(frame=>{const img=frame.querySelector('img');const inset=parseFloat(getComputedStyle(frame).paddingTop)*2;frame.style.setProperty('--pan',Math.min(0,frame.clientHeight-inset-img.offsetHeight)+'px')}) }
$$('.design-card.long img').forEach(img=>img.addEventListener('load',measurePosters));
addEventListener('resize',measurePosters);$$('[data-filter]').forEach(b=>b.addEventListener('click',()=>requestAnimationFrame(measurePosters)));measurePosters();
// Mouse dragging complements native touch scrolling and keyboard buttons.
let dragStart=0,dragScroll=0,dragging=false,dragMoved=false;
rail.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse'||e.button!==0)return;dragStart=e.clientX;dragScroll=rail.scrollLeft;dragging=true;dragMoved=false});
addEventListener('pointermove',e=>{if(!dragging)return;const distance=e.clientX-dragStart;if(Math.abs(distance)>6){dragMoved=true;rail.classList.add('dragging');rail.scrollLeft=dragScroll-distance}});
addEventListener('pointerup',()=>{dragging=false;rail.classList.remove('dragging')});
addEventListener('pointercancel',()=>{dragging=false;dragMoved=false;rail.classList.remove('dragging')});
rail.addEventListener('click',e=>{if(dragMoved){e.preventDefault();e.stopImmediatePropagation();dragMoved=false}},true);
rail.addEventListener('dragstart',e=>e.preventDefault());
// Keep one soundtrack active at a time, without autoplay or eager video downloads.
$$('video').forEach(player=>player.addEventListener('play',()=>$$('video').forEach(other=>{if(other!==player)other.pause()})));
