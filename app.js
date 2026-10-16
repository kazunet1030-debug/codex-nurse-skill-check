const screen = document.querySelector('#screen');
const backButton = document.querySelector('#backButton');
const stepCount = document.querySelector('#stepCount');
const progressBar = document.querySelector('#progressBar');
const templates = Object.fromEntries(['start','question','story','scale','multi','profile','value','comparison','setup','result','evidence','quickResult'].map(name => [name, document.querySelector(`#${name}Template`)]));

const quickSteps = [
  {type:'question',section:'1 / 5',title:'仕事でAIを使っていますか？',options:[['🌱','まだ使っていない',1],['🧪','数回試した',2],['📝','ときどき使う',3],['⚙️','日常的に使う',5]]},
  {type:'question',section:'2 / 5',title:'一番ラクにしたい仕事は？',options:[['📄','文書・資料・メール',4,'documents'],['🔎','調査・情報整理',4,'research'],['🔁','転記・集計などの定型作業',4,'automation'],['🤷','まだ決まっていない',1,'discovery']]},
  {type:'question',section:'3 / 5',title:'AIに入力する情報のルールは？',note:'匿名化しても再識別の可能性があります。患者情報は入力せず、所属施設の規定を確認してください。',options:[['🔒','職場のルールと承認済み環境がある',5],['🧭','患者情報は入力せず、施設規定を確認する',3],['☁️','特に決めていない',0],['❓','よくわからない',1]]},
  {type:'evidence'},
  {type:'question',section:'4 / 5',title:'AI活用の成果をどう測りますか？',options:[['📊','時間・件数・品質で測る',5],['🎯','改善したい仕事は決めている',3],['✨','便利なら成功',1],['❓','まだ決めていない',0]]},
  {type:'question',section:'5 / 5',title:'AIの出力を誰が確認しますか？',options:[['✅','担当者と責任者',5],['👤','作成した本人',3],['🤖','ほぼ確認しない',0],['❓','まだ決めていない',1]]},
  {type:'quickResult'}
];

const fullSteps = [
  {type:'story',section:'WELCOME',title:'すでに一歩、先へ進んでいます。',text:'AIを「知っている」から、仕事の相棒として安全に使う段階へ。Codexは文章だけでなく、調査・ファイル整理・実装・検証まで一連の仕事を支援できます。',visual:'intro'},
  {type:'question',section:'01 / PURPOSE',title:'Codexを学ぶ一番の目的は？',note:'今の気持ちに最も近いものを選んでください。',options:[['⏱️','記録や資料作成を効率化したい',3],['🧠','考えを整理し、判断の質を上げたい',4],['📚','教育・研修をもっと良くしたい',4],['🚀','新しいサービスやキャリアにつなげたい',3]]},
  {type:'question',section:'02 / KNOWLEDGE',title:'今のAI・Codex知識はどのくらい？',options:[['🌱','これから始める',1],['🧩','基本は知っている',2],['📈','主要な考え方は理解している',4],['🏅','複数工程で使える上級レベル',5]]},
  {type:'multi',section:'03 / TOOLS',title:'使ったことのあるAIツールは？',options:[['◉','ChatGPT / Codex','openai'],['✦','Gemini','gemini'],['✺','Claude','claude'],['▰','Microsoft Copilot','copilot'],['⌕','Perplexity','perplexity'],['＋','その他','other']]},
  {type:'multi',section:'04 / USE CASE',title:'AIをどこで活用したいですか？',options:[['✉️','メール・コミュニケーション','communication'],['📄','文書・研修資料','documents'],['📊','データ・スプレッドシート','data'],['⚙️','定型作業の自動化','automation'],['💡','アイデア出し・問題解決','ideas'],['✨','日常のパーソナルタスク','personal']]},
  {type:'story',section:'WHY CODEX',title:'経験は、AI時代にも強い武器です。',text:'臨床で培った観察、優先順位、リスク感覚は、AIの出力を評価する力になります。AIに任せるのではなく、経験を起点に指示し、確かめることが大切です。'},
  {type:'question',section:'CAREER GOAL',title:'AI活用で目指したいキャリアの変化は？',note:'目標整理のための質問です。収入や昇進を保証するものではありません。',options:[['🕊️','今の収入を保ち、時間の余裕を増やしたい',3,'time'],['💴','月1〜3万円相当の副収入・手当を目指したい',3,'side-small'],['📈','月3〜10万円相当の新しい仕事を目指したい',3,'side-growth'],['🚀','年収アップにつながる役割・転職を目指したい',3,'career']]},
  {type:'scale',statement:'新しいツールでも、目的が分かれば試してみたい。'},
  {type:'scale',statement:'AIの答えは、根拠や最新性を確かめてから使う。'},
  {type:'value'},
  {type:'question',section:'05 / BASICS',title:'Codexへの依頼で最初に伝えるのは？',options:[['🎯','目的・利用者・ほしい成果物',5],['⚡','とにかく急いでと伝える',1],['📏','文字数だけ指定する',2],['🤷','何も決めず全部任せる',0]]},
  {type:'question',section:'06 / PRIVACY',title:'患者事例を相談するとき、最優先することは？',options:[['🔒','個人を特定できる情報を除き、規定を確認する',5],['📋','情報が多いほど良いので全記録を貼る',0],['👤','氏名だけ消せば十分',1],['☁️','AIなら安全なので気にしない',0]]},
  {type:'question',section:'07 / FACT CHECK',title:'Codexが示した医療情報はどう扱う？',options:[['✅','一次資料・添付文書・施設手順で確認する',5],['🤖','自然な文章ならそのまま使う',0],['📱','SNS投稿と一致すれば使う',1],['📅','新しそうなら確認しない',0]]},
  {type:'question',section:'08 / PROMPT',title:'良い依頼に含めたい要素は？',options:[['🧩','背景・目的・制約・出力形式・確認基準',5],['📣','強い命令と感嘆符',1],['📚','長い情報を整理せず全部貼る',1],['✨','「いい感じに」の一言',0]]},
  {type:'scale',statement:'作業を頼む前に、完成と呼べる条件を言葉にできる。'},
  {type:'scale',statement:'AIの出力に誤りがあり得ることを前提に確認できる。'},
  {type:'story',section:'CORE SKILL 01',title:'上手な人ほど「完成条件」を先に決めます。',text:'「資料を作って」だけでなく、誰が・どこで・何のために使い、何を確認すれば完成なのかを伝えると、Codexは実務のパートナーになります。'},
  {type:'question',section:'09 / WORKFLOW',title:'複雑な仕事を頼むときの進め方は？',options:[['🪜','工程を分け、重要な節目で確認する',5],['🎲','一度に全部任せて結果だけ待つ',1],['🔁','同じ指示を何度も送る',1],['🗑️','うまくいかなければ最初から捨てる',0]]},
  {type:'question',section:'10 / FILES',title:'既存ファイルを修正するとき大切なのは？',options:[['🛡️','元の変更を保ち、差分とテストを確認する',5],['♻️','全部新しく上書きする',0],['👀','見た目だけ確認する',1],['📤','確認せずすぐ共有する',0]]},
  {type:'question',section:'11 / EVIDENCE',title:'「公開できた」と判断できる証拠は？',options:[['🌍','公開URLと外部環境での表示確認',5],['💾','ローカルに保存したファイル',1],['📝','公開用の文章を作ったこと',1],['💭','公開したつもりになったこと',0]]},
  {type:'question',section:'12 / AUTOMATION',title:'自動化に向いている仕事は？',options:[['🔄','手順と確認基準が明確な反復作業',5],['⚖️','責任者の判断が必要な例外対応',1],['🚨','緊急時の臨床判断そのもの',0],['🤫','個人情報を無制限に扱う処理',0]]},
  {type:'scale',statement:'「作成した」と「検証した」と「届けた」を分けて考えている。'},
  {type:'scale',statement:'AIに任せる範囲と、人が判断する範囲を決められる。'},
  {type:'comparison'},
  {type:'question',section:'13 / REVIEW',title:'出力に自信がないときは？',options:[['🔍','不確実な点を示し、別根拠や反証を確認する',5],['🙈','自信がある文章に書き換える',0],['📢','そのまま外部へ送る',0],['🎨','見た目を整えてごまかす',0]]},
  {type:'question',section:'14 / ERROR',title:'同じ問題で修正が続くときは？',options:[['🧪','原因仮説と検証結果を整理し、別視点を入れる',5],['🔨','同じ修正を繰り返す',1],['🧹','関係するものを全部削除する',0],['🚪','未確認のまま完了にする',0]]},
  {type:'question',section:'15 / CLINICAL',title:'臨床教育資料で守るべき境界は？',options:[['🏥','ガイドライン・施設手順・教育目的を明示する',5],['🩹','AIの回答を臨床指示として扱う',0],['⭐','読みやすければ出典は不要',0],['🧑‍⚕️','対象者が看護師なら注意書きは不要',1]]},
  {type:'question',section:'16 / IMPROVE',title:'成果を改善する最初の一歩は？',options:[['📈','最大のボトルネックを1つ選び、小さく検証する',5],['🎆','多くの要素を同時に変える',1],['💬','感想だけで成功と判断する',1],['🏁','公開したら計測を終える',0]]},
  {type:'scale',statement:'必要ならCodexに「反対意見や見落とし」を出させられる。'},
  {type:'scale',statement:'成果を確認する数字や証拠を、作業前に決めている。'},
  {type:'profile'},
  {type:'scale',statement:'Codexを使って、実際の小さな成果物を今週1つ完成させたい。'},
  {type:'question',section:'17 / FIRST ACTION',title:'最初に試したい実務は？',note:'結果画面の「次の一歩」に反映します。',options:[['📝','研修資料・文章のたたき台',3,'draft'],['🔎','根拠のある情報収集・整理',3,'research'],['🗂️','ファイル・定型作業の整理',3,'workflow'],['💡','新しい企画の試作品',3,'prototype']]},
  {type:'result'}
];

let current = 0;
let answers = {};
let mode = null;
let resultReady = false;
let setupTimer;
let resultSlide = 0;
function activeSteps(){return mode==='quick'?quickSteps:fullSteps}
function totalSteps(){return activeSteps().length}

function setChrome(){
  const onStart = current === 0;
  const total = totalSteps();
  backButton.disabled = onStart;
  stepCount.textContent = onStart ? 'START' : current >= total ? 'RESULT' : `${current} / ${total}`;
  progressBar.style.width = onStart ? '0' : `${Math.min(100,current/total*100)}%`;
}

function clone(name){
  screen.replaceChildren(templates[name].content.cloneNode(true));
  requestAnimationFrame(()=>{
    const heading=screen.querySelector('h1,h2');
    if(heading){heading.tabIndex=-1;heading.focus({preventScroll:true});}
  });
}

function render(){
  setChrome();
  if(current === 0){clone('start');return;}
  const step = activeSteps()[current-1];
  if(!step){current=0;render();return;}
  if(step.type === 'result'){
    if(resultReady) renderResult(); else renderSetup();
    return;
  }
  if(step.type === 'quickResult'){renderQuickResult();return;}
  if(step.type === 'evidence'){clone('evidence');return;}
  if(step.type === 'value'){clone('value');return;}
  if(step.type === 'comparison'){clone('comparison');return;}
  if(step.type === 'profile'){renderProfile();return;}
  if(step.type === 'multi'){
    clone('multi');
    screen.querySelector('#multiLabel').textContent=step.section;
    screen.querySelector('#multiTitle').textContent=step.title;
    const list=screen.querySelector('#multiList');
    const selected=new Set(answers[current]?.values||[]);
    step.options.forEach(option=>{
      const b=document.createElement('button');b.type='button';b.className=`answer multi-answer${selected.has(option[2])?' selected':''}`;b.dataset.value=option[2];b.setAttribute('aria-pressed',selected.has(option[2])?'true':'false');
      b.innerHTML=`<span class="answer-icon" aria-hidden="true">${option[0]}</span><span>${option[1]}</span><span class="answer-check" aria-hidden="true"></span>`;list.append(b);
    });
    screen.querySelector('#multiNext').disabled=selected.size===0;
    return;
  }
  if(step.type === 'story'){
    clone('story');
    screen.querySelector('#storyLabel').textContent=step.section;
    screen.querySelector('#storyTitle').textContent=step.title;
    screen.querySelector('#storyText').textContent=step.text;
    return;
  }
  if(step.type === 'scale'){
    clone('scale');screen.querySelector('#scaleStatement').textContent=step.statement;
    const faces=['😟','🙁','🤷','🙂','🙌'];
    const wrap=screen.querySelector('#scaleOptions');
    faces.forEach((face,i)=>{const b=document.createElement('button');b.type='button';b.className='scale-button';b.textContent=face;b.dataset.score=step.reverse?5-i:i+1;b.dataset.value=i+1;b.setAttribute('aria-label',`${i+1}/5`);b.setAttribute('role','radio');b.setAttribute('aria-checked','false');wrap.append(b)});
    return;
  }
  clone('question');
  screen.querySelector('#sectionLabel').textContent=step.section;
  screen.querySelector('#questionTitle').textContent=step.title;
  const note=screen.querySelector('#questionNote');note.textContent=step.note||'';note.hidden=!step.note;
  const list=screen.querySelector('#answerList');
  step.options.forEach((option,i)=>{
    const b=document.createElement('button');b.type='button';b.className='answer';b.dataset.score=option[2];b.dataset.value=option[3]||i;
    b.innerHTML=`<span class="answer-icon" aria-hidden="true">${option[0]}</span><span>${option[1]}</span><span class="answer-check" aria-hidden="true"></span>`;list.append(b);
  });
}

function recordAndNext(button){
  answers[current]={score:Number(button.dataset.score),value:button.dataset.value};
  button.classList.add('selected');
  if(button.matches('.scale-button')) button.setAttribute('aria-checked','true');
  document.querySelectorAll('button').forEach(b=>b.disabled=true);
  setTimeout(()=>{current++;render();window.scrollTo(0,0)},180);
}

function renderResult(){
  clearTimeout(setupTimer);
  resultSlide=0;
  clone('result');
  const scored=Object.values(answers).map(a=>a.score).filter(Number.isFinite);
  const percent=Math.round((scored.reduce((a,b)=>a+b,0)/(scored.length*5))*100)||0;
  let result;
  if(percent>=84) result={level:4,title:'実装リード',summary:'回答上は、目的から検証までをつなぐ傾向が見られます。安全境界を守りながら、小さな成果物からチームでの実践へ広げましょう。'};
  else if(percent>=68) result={level:3,title:'安全実践者',summary:'Codexの強みと限界を理解し、実務で安全に使う基礎が整っています。次は小さな仕事を完成まで一貫して進めましょう。'};
  else if(percent>=48) result={level:2,title:'成長オペレーター',summary:'AI活用の入口はつかめています。完成条件と検証方法を先に決めることで、出力の質と安心感が大きく高まります。'};
  else result={level:1,title:'スタートナビゲーター',summary:'今が安全な第一歩を始めるタイミングです。患者情報を使わない小さな文章作成から、目的・出力・確認の3点を意識して試しましょう。'};
  const buckets=[
    ['指示設計',average([11,14,15,18])],['安全・検証',average([12,13,16,19,26,27])],
    ['実行・改善',average([20,21,22,23,28,29])],['AIマインド',average([8,9,10,30,32])]
  ];
  screen.querySelector('#resultLevel').textContent=result.level;
  screen.querySelector('#resultTitle').textContent=result.title;
  screen.querySelector('#resultSummary').textContent=result.summary;
  screen.querySelector('#resultScore').textContent=`${percent} / 100`;
  requestAnimationFrame(()=>screen.querySelector('#scoreBar').style.width=`${percent}%`);
  const grid=screen.querySelector('#strengthGrid');
  buckets.forEach(([name,val])=>grid.insertAdjacentHTML('beforeend',`<div class="strength"><span>${name}</span><strong>${labelFor(val)}</strong><i><b style="width:${val}%"></b></i></div>`));
  const choice=Object.values(answers).find(a=>['draft','research','workflow','prototype'].includes(a.value))?.value||'draft';
  const actions={draft:['15分で「研修メモ」を1枚作る','対象者・目的・根拠・出力形式を伝え、最後に事実確認リストも出してもらいましょう。'],research:['1テーマを一次資料から調べる','調査日と出典URLを残し、分からない点は「未確認」と分けるよう依頼しましょう。'],workflow:['反復作業を1つ手順化する','入力・処理・確認・完了証拠の4段階に分け、個人情報を使わない例で試しましょう。'],prototype:['30分で小さな試作品を作る','利用者の課題を1つに絞り、完成条件を3つ決めてからCodexと形にしましょう。']};
  screen.querySelector('#nextAction').textContent=actions[choice][0];screen.querySelector('#nextDetail').textContent=actions[choice][1];
  screen.querySelector('#certificateType').textContent=`LEVEL ${result.level} — ${result.title}`;
  screen.querySelector('#certificateDate').textContent=new Intl.DateTimeFormat('ja-JP',{dateStyle:'long'}).format(new Date());
  buildPlan(choice);
  renderResultSlide();
  setChrome();
}

function renderSetup(){
  clone('setup');
  stepCount.textContent='ANALYZING';
  progressBar.style.width='100%';
  backButton.disabled=true;
  const useLabels={communication:'コミュニケーション',documents:'文書・研修資料',data:'データ整理',automation:'自動化',ideas:'問題解決',personal:'日常タスク'};
  const chosen=(answers[5]?.values||[]).slice(0,3).map(v=>useLabels[v]).filter(Boolean);
  const numeric=Object.values(answers).map(a=>a.score).filter(Number.isFinite);
  const score=numeric.length?Math.round(numeric.reduce((a,b)=>a+b,0)/(numeric.length*5)*100):0;
  const tags=[...chosen,`安全・検証：${labelFor(score)}`,'1日15分'].slice(0,4);
  screen.querySelector('#setupTags').innerHTML=tags.map(tag=>`<span>${tag}</span>`).join('');
  setupTimer=setTimeout(showResult,3800);
}

function showResult(){
  clearTimeout(setupTimer);
  resultReady=true;
  renderResult();
  window.scrollTo(0,0);
}

function buildPlan(choice){
  const common={
    draft:['研修メモ完成コース','対象者・根拠・確認項目が明確な研修メモを1枚完成させる。'],
    research:['根拠あるリサーチコース','一次資料と確認日が明記された、1テーマの調査メモを完成させる。'],
    workflow:['定型作業の整理コース','個人情報を使わない反復作業を、再利用できる手順書にする。'],
    prototype:['小さな試作品コース','利用者の課題を1つ解決する、触って確認できる試作品を完成させる。']
  };
  const specific={
    draft:[['目的を1文にする','誰が、何のために使うかを決める'],['素材を整理する','使える情報と未確認情報を分ける'],['Codexへ依頼する','背景・制約・出力形式を伝える'],['根拠を確認する','一次資料と施設手順で照合する'],['読み手目線で直す','専門用語と情報量を調整する'],['第三者チェック','反対意見と見落としを出してもらう'],['完成・保存する','最終確認を行い版を残す']],
    research:[['問いを絞る','調べたいことを1つの問いにする'],['情報源を決める','一次資料と公的情報を優先する'],['検索条件を作る','期間・対象・除外条件を決める'],['内容を比較する','一致点と相違点を整理する'],['未確認を分ける','推測を事実と混ぜない'],['引用元を確認する','URL・日付・発行元を残す'],['調査メモを完成','結論と限界を1枚にまとめる']],
    workflow:[['対象を1つ選ぶ','繰り返し発生する安全な作業を選ぶ'],['現状を記録する','入力・処理・出力を書き出す'],['判断箇所を分ける','人が確認する工程を明確にする'],['手順を作る','Codexと短いチェックリストにする'],['例で試す','架空データで一度実行する'],['失敗条件を追加','止める条件と戻し方を決める'],['再利用版を保存','日付と版を付けて完成させる']],
    prototype:[['課題を1つ選ぶ','利用者と困りごとを具体化する'],['完成条件を3つ決める','何ができれば使えるかを定義する'],['最小構成を描く','必要な画面・内容だけに絞る'],['Codexと作る','小さく実装して動かす'],['操作を試す','利用者の動線で確認する'],['一つだけ改善','最大のつまずきを修正する'],['結果を残す','成果物・検証結果・次の課題を記録する']]
  };
  const key=common[choice]?choice:'draft';
  screen.querySelector('#planGoal').textContent=common[key][1];
  screen.querySelector('#planSlides').innerHTML=specific[key].map((d,i)=>`<section class="result-slide" data-result-slide="${i+3}" hidden><p class="section-label">${common[key][0]}</p><p class="slide-position">DAY ${i+1} / 7</p><div class="plan-day-card"><span class="plan-day-number">DAY<br>${i+1}</span><h2>${d[0]}</h2><p>${d[1]}</p><div class="plan-day-meta"><span>約15分</span><span>保存して実行</span></div></div><button class="primary slide-next" type="button" data-action="result-next">${i===6?'完成目標を見る':'次の日へ'} <span>→</span></button></section>`).join('');
}

function renderResultSlide(){
  screen.querySelectorAll('[data-result-slide]').forEach(slide=>{slide.hidden=Number(slide.dataset.resultSlide)!==resultSlide});
  stepCount.textContent=`RESULT ${resultSlide+1} / 11`;
  progressBar.style.width=`${(resultSlide+1)/11*100}%`;
  window.scrollTo(0,0);
}

function renderProfile(){
  clone('profile');
  const scored=Object.values(answers).map(a=>a.score).filter(Number.isFinite);
  const percent=Math.round((scored.reduce((a,b)=>a+b,0)/(scored.length*5))*100)||0;
  const safe=Math.round((average([12,13,16,19,26,27])+average([20,21,22,23,28,29]))/2)||percent;
  screen.querySelector('#profileScore').textContent=`${percent} / 100`;
  screen.querySelector('#profilePin').style.left=`${Math.max(4,Math.min(96,percent))}%`;
  screen.querySelector('#profileMeter').style.width=`${percent}%`;
  screen.querySelector('#profileMessage').textContent=percent>=70?'安全に使う基礎が整っています。残りの設問で、検証と改善の力を確認します。':'伸びしろがはっきりしています。完成条件と確認方法を意識すると、Codexの実務力が上がります。';
  const toolCount=answers[4]?.values?.length||0;
  const useCount=answers[5]?.values?.length||0;
  screen.querySelector('#profileFacts').innerHTML=`<div class="profile-fact"><span>利用経験</span><strong>${toolCount?`${toolCount}ツール`:'これから'}</strong></div><div class="profile-fact"><span>活用したい領域</span><strong>${useCount?`${useCount}領域`:'未選択'}</strong></div><div class="profile-fact"><span>安全・検証</span><strong>${labelFor(safe)}</strong></div><div class="profile-fact"><span>回答状況</span><strong>${Object.keys(answers).length}項目</strong></div>`;
}

function renderQuickResult(){
  clone('quickResult');
  const scored=Object.values(answers).map(a=>a.score).filter(Number.isFinite);
  const percent=Math.round((scored.reduce((a,b)=>a+b,0)/(scored.length*5))*100)||0;
  let result;
  const bottleneck=answers[2]?.value||'discovery';
  const themes={documents:['文書・資料作成の標準化','よく作る文書を1つ選び、入力情報・完成条件・確認項目をテンプレート化しましょう。'],research:['調査・情報整理の高速化','情報源、対象期間、出力形式を決め、出典付きの調査メモを1つ作りましょう。'],automation:['定型作業の自動化候補整理','反復作業を入力・処理・確認・完了の4段階に分け、まず架空データで検証しましょう。'],discovery:['AI導入テーマの絞り込み','毎週発生する業務を時間順に3つ書き出し、最も負担が大きい1件から検証しましょう。']};
  if(percent>=76) result={title:'導入実行フェーズ',summary:'目的・情報管理・評価・確認体制が比較的整っています。対象業務を1つに絞れば、小さな実証を始められる段階です。'};
  else if(percent>=46) result={title:'導入設計フェーズ',summary:'AI活用の入口は見えています。対象業務、成功指標、確認責任をそろえると、実行可能な導入計画になります。'};
  else result={title:'課題整理フェーズ',summary:'ツール選定より先に、改善したい業務と情報管理の境界を整理する段階です。小さく安全な題材から始めましょう。'};
  result.action=themes[bottleneck][0];result.detail=themes[bottleneck][1];
  screen.querySelector('#quickScore').textContent=percent;
  screen.querySelector('#quickTitle').textContent=result.title;
  screen.querySelector('#quickSummary').textContent=result.summary;
  screen.querySelector('#quickAction').textContent=result.action;
  screen.querySelector('#quickDetail').textContent=result.detail;
  setChrome();
}

function average(keys){const vals=keys.map(k=>answers[k]?.score).filter(Number.isFinite);return vals.length?Math.round(vals.reduce((a,b)=>a+b,0)/(vals.length*5)*100):0}
function labelFor(v){return v>=80?'強み':v>=60?'実践中':v>=40?'成長中':'これから'}

function resetAssessment(nextMode=null){
  clearTimeout(setupTimer);answers={};resultReady=false;resultSlide=0;mode=nextMode;current=nextMode?1:0;render();window.scrollTo(0,0);
}

screen.addEventListener('click',e=>{
  const button=e.target.closest('button');if(!button)return;
  if(button.dataset.action==='choose-mode'){resetAssessment(button.dataset.mode);}
  else if(button.dataset.action==='start-full'){resetAssessment('full');}
  else if(button.dataset.action==='start'||button.dataset.action==='next'){current++;render();window.scrollTo(0,0)}
  else if(button.dataset.action==='show-result')showResult();
  else if(button.dataset.action==='result-next'){resultSlide=Math.min(10,resultSlide+1);renderResultSlide();}
  else if(button.dataset.action==='show-plan'){resultSlide=3;renderResultSlide();}
  else if(button.matches('.multi-answer')){
    button.classList.toggle('selected');
    button.setAttribute('aria-pressed',button.classList.contains('selected')?'true':'false');
    const values=[...screen.querySelectorAll('.multi-answer.selected')].map(b=>b.dataset.value);
    answers[current]={values};screen.querySelector('#multiNext').disabled=values.length===0;
  }
  else if(button.id==='multiNext'){current++;render();window.scrollTo(0,0)}
  else if(button.dataset.action==='restart'){resetAssessment();}
  else if(button.dataset.action==='print')window.print();
  else if(button.matches('.answer,.scale-button'))recordAndNext(button);
});
backButton.addEventListener('click',()=>{
  if(mode==='full'&&resultReady&&current===totalSteps()&&resultSlide>0){resultSlide--;renderResultSlide();return;}
  if(current>0){clearTimeout(setupTimer);resultReady=false;resultSlide=0;current--;render();window.scrollTo(0,0)}
});
document.querySelector('#homeLink').addEventListener('click',e=>{e.preventDefault();resetAssessment()});
render();
