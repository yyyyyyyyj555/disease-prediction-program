document.addEventListener('DOMContentLoaded', () => {
    // 페이지 요소 가져오기
    const firstPage = document.getElementById('first-page');
    const testPage = document.getElementById('test-page');
    const resultPage = document.getElementById('result-page');
    const startBtn = document.getElementById('start-btn');
    const symptomsContainer = document.getElementById('symptoms-container');
    const resultBtn = document.getElementById('result-btn');
    const rank1 = document.getElementById('rank-1');
    const rank2 = document.getElementById('rank-2');
    const rank3 = document.getElementById('rank-3');
    const rank1Container = document.getElementById('rank-1-container');
    const rank2Container = document.getElementById('rank-2-container');
    const rank3Container = document.getElementById('rank-3-container');

    // 증상 목록
    const symptoms = [
        "발열", "기침", "인후통", "근육통", "두통",
        "감각 상실", "호흡 곤란", "의식 저하", "가려움증",
        "발진", "콧물", "피로감", "구토", "설사", "답답함",
        "복통", "어지러움"
    ];

    //  증상별 가중치 (중요도에 따라 1~5점 부여)
    const symptomWeights = {
        "발열": 3, "기침": 2, "인후통": 2, "근육통": 1, "두통": 2,
        "감각 상실": 4, "호흡 곤란": 5, "의식 저하": 5, "가려움증": 1,
        "발진": 2, "콧물": 1, "피로감": 1, "구토": 3, "설사": 3, "답답함": 2,
        "복통": 3, "어지러움": 3
    };

    // 질병 데이터
    const diseases = {
        "독감": ["발열", "기침", "인후통", "근육통", "두통", "콧물", "피로감", "구토"],
        "코로나": ["발열", "기침", "인후통", "근육통", "두통", "감각 상실", "호흡 곤란"],
        "알러지": ["가려움증", "발진", "피로감", "콧물", "기침", "인후통", "두통"],
        "빈혈": ["감각 상실", "의식 저하", "피로감", "두통", "호흡 곤란", "어지러움"],
        "식중독": ["구토", "설사"],
        "장염": ["복통", "두통", "구토", "설사", "근육통"],
        "천식": ["호흡 곤란", "기침", "답답함"],
        "비만": ["피로감", "호흡 곤란", "어지러움"],
        "아토피 피부염": ["가려움증", "발진", "피로감"]
    };

    // 첫 페이지에서 '검사하기' 버튼 클릭 시
    startBtn.addEventListener('click', () => {
        firstPage.classList.remove('active');
        testPage.classList.add('active');
    });

    // 증상 버튼 동적 생성
    symptoms.forEach(symptom => {
        const button = document.createElement('button');
        button.className = 'symptom-btn';
        button.textContent = symptom;
        button.dataset.symptom = symptom;
        symptomsContainer.appendChild(button);
    });

    let selectedSymptoms = new Set();

    // 증상 버튼 클릭 이벤트
    symptomsContainer.addEventListener('click', (event) => {
        const target = event.target;
        if (target.classList.contains('symptom-btn')) {
            target.classList.toggle('selected');
            const symptom = target.dataset.symptom;

            if (target.classList.contains('selected')) {
                selectedSymptoms.add(symptom);
            } else {
                selectedSymptoms.delete(symptom);
            }

            resultBtn.disabled = selectedSymptoms.size === 0;
        }
    });

    // '결과 보기' 버튼 클릭 시
    resultBtn.addEventListener('click', () => {
        if (!resultBtn.disabled) {
            const diseaseScores = [];

            for (const disease in diseases) {
                const diseaseSymptoms = diseases[disease];
                let weightedScore = 0;
                let maxPossibleScore = 0; // 해당 질병이 얻을 수 있는 최대 점수

                diseaseSymptoms.forEach(symptom => {
                    if (symptomWeights.hasOwnProperty(symptom)) {
                        maxPossibleScore += symptomWeights[symptom];
                        if (selectedSymptoms.has(symptom)) {
                            weightedScore += symptomWeights[symptom];
                        }
                    }
                });

                //  가중치를 반영한 확률 계산
                let score = 0;
                if (maxPossibleScore > 0) {
                    score = (weightedScore / maxPossibleScore);
                }

                diseaseScores.push({ name: disease, score: score });
            }

            // 점수가 높은 순서대로 정렬
            diseaseScores.sort((a, b) => b.score - a.score);

            // 점수의 합계를 구하여 정규화
            const totalScore = diseaseScores.reduce((sum, item) => sum + item.score, 0);

            // 모든 순위 컨테이너 숨기기
            rank1Container.style.display = 'none';
            rank2Container.style.display = 'none';
            rank3Container.style.display = 'none';

            // 결과 표시
            if (diseaseScores.length > 0 && totalScore > 0) {
                // 1순위
                const rank1Score = (diseaseScores[0].score / totalScore) * 100;
                rank1Container.style.display = 'flex';
                rank1.textContent = `${diseaseScores[0].name} (${rank1Score.toFixed(1)}%)`;

                // 2순위
                if (diseaseScores.length > 1 && diseaseScores[1].score > 0) {
                    const rank2Score = (diseaseScores[1].score / totalScore) * 100;
                    rank2Container.style.display = 'flex';
                    rank2.textContent = `${diseaseScores[1].name} (${rank2Score.toFixed(1)}%)`;
                }

                // 3순위
                if (diseaseScores.length > 2 && diseaseScores[2].score > 0) {
                    const rank3Score = (diseaseScores[2].score / totalScore) * 100;
                    rank3Container.style.display = 'flex';
                    rank3.textContent = `${diseaseScores[2].name} (${rank3Score.toFixed(1)}%)`;
                }
            } else {
                // 일치하는 증상이 없는 경우
                rank1Container.style.display = 'flex';
                rank1.textContent = '일치하는 질병이 없습니다.';
            }

            testPage.classList.remove('active');
            resultPage.classList.add('active');
        }
    });
});

