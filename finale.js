(() => {
 let data={};try{data=JSON.parse(sessionStorage.getItem('shuimu.journey.v1')||'{}');}catch{}
 const phrase=typeof data.phrase==='string'&&data.confirmedAt?data.phrase:'';
 const phraseNode=document.getElementById('originalPhrase'),save=document.getElementById('savePoem'),status=document.getElementById('saveStatus');
 const chars=Array.from(phrase),lines=[];for(let i=0;i<chars.length;i+=6)lines.push(chars.slice(i,i+6).join(''));
 if(phrase){
  document.querySelector('.poetry').classList.add('has-phrase');document.querySelector('.poem-clear').hidden=false;
  for(const text of lines){const line=document.createElement('span');line.textContent=text;line.style.display='block';phraseNode.append(line);}
 }else{phraseNode.textContent='你的句子，落在这里';}
 const marks=[];if(phrase)marks.push('木字\n留言');if(data.operaPlayed===true)marks.push('戏中\n相逢');
 for(const text of marks){const stamp=document.createElement('span');stamp.className='mark';stamp.textContent=text;document.getElementById('marks').append(stamp);}
 save.disabled=!phrase;
 if(!phrase){save.title='先到木活字页刷印并确认你的原句';document.getElementById('afterword').textContent='回到木活字页，刷印并确认你的原句。';document.getElementById('returnType').textContent='去造一句自己的话';}
 const bg=new Image();bg.src='assets/finale-ouyue.png';
 const clean=new Image();clean.src='assets/finale-clean.png';
 save.addEventListener('click',async()=>{
  if(!phrase)return;save.disabled=true;status.textContent='正在收下这一笔…';
  try{
   await Promise.all([bg.decode(),clean.decode()]);await document.fonts.load('300 42px "Shuimu Silk"',phrase);
   const c=document.createElement('canvas');c.width=1672;c.height=941;const ctx=c.getContext('2d');ctx.drawImage(bg,0,0,1672,941);
   // Clear only the printed sample phrase and stamps, keeping the new painting intact.
   ctx.drawImage(clean,1028,420,335,197,1028,420,335,197);
   ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#725876';
   ctx.font='300 44px "Shuimu Silk", serif';lines.forEach((line,i)=>ctx.fillText(line,1195,486+(i-(lines.length-1)/2)*62));
   let x=marks.length===2?1147:1195;
   for(const mark of marks){ctx.strokeStyle='#a64436';ctx.lineWidth=2;ctx.strokeRect(x-25,558,50,55);ctx.fillStyle='#963b2f';ctx.font='300 20px "Shuimu Silk",serif';mark.split('\n').forEach((t,i)=>ctx.fillText(t,x,575+i*22));x+=96;}
   const blob=await new Promise(r=>c.toBlob(r,'image/png'));if(!blob)throw Error('image');const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='我的瓯越诗笺.png';a.click();window.JourneySfx?.cue('collect');setTimeout(()=>URL.revokeObjectURL(url),20000);status.textContent='诗笺已下载，原句逐字保留。';
  }catch{status.textContent='未能下载，请稍后再试。';}finally{save.disabled=false;}
 });
})();
