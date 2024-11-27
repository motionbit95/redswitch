const admin = require("firebase-admin");

// Realtime Database 참조
const db = admin.database();

class Question {
  constructor(index, question, question_pk) {
    this.index = index;
    this.question = question;
    this.question_pk = question_pk;
  }

  add() {
    const ref = db.ref("bdsm_questions"); // "bdsm_questions" 테이블(참조) 생성
    const newBdsmQuestionRef = ref.push(); // 고유 키로 새 데이터 생성
    newBdsmQuestionRef.set(this);
  }
}

class Answer {
  constructor(
    index,
    question_pk,
    step,
    master_mistress_,
    slave_,
    hunter_,
    prey_,
    brat_tamer_,
    brat_,
    owner_,
    pet_,
    daddy_mommy_,
    little_,
    sadist_,
    masochist_,
    spanker_,
    spankee_,
    degrader_,
    degradee_,
    rigger_,
    rope_bunny_,
    dominant_,
    submissive_,
    switch_,
    vanilla_
  ) {
    this.index = index;
    this.question_pk = question_pk;
    this.step = step;
    this.master_mistress_ = master_mistress_;
    this.slave_ = slave_;
    this.hunter_ = hunter_;
    this.prey_ = prey_;
    this.brat_tamer_ = brat_tamer_;
    this.brat_ = brat_;
    this.owner_ = owner_;
    this.pet_ = pet_;
    this.daddy_mommy_ = daddy_mommy_;
    this.little_ = little_;
    this.sadist_ = sadist_;
    this.masochist_ = masochist_;
    this.spanker_ = spanker_;
    this.spankee_ = spankee_;
    this.degrader_ = degrader_;
    this.degradee_ = degradee_;
    this.rigger_ = rigger_;
    this.rope_bunny_ = rope_bunny_;
    this.dominant_ = dominant_;
    this.submissive_ = submissive_;
    this.switch_ = switch_;
    this.vanilla_ = vanilla_;
  }

  add() {
    const ref = db.ref("bdsm_answers"); // "bdsm" 테이블(참조) 생성
    const newBdsmRef = ref.push(); // 고유 키로 새 데이터 생성
    newBdsmRef.set(this);
  }

  async update() {
    try {
      const ref = db.ref("bdsm_answers");
      const snapshot = await ref
        .orderByChild("index")
        .equalTo(this.index)
        .once("value");

      if (!snapshot.exists()) {
        throw new Error("해당 index에 해당하는 데이터가 없습니다.");
      }

      // Firebase에서 key 추출
      const [key] = Object.keys(snapshot.val());

      // 필드 값 중 `undefined` 값을 null로 변경
      const updatedData = {
        index: this.index,
        question_pk: this.question_pk,
        step: this.step,
        master_mistress_: this.master_mistress_ || null,
        slave_: this.slave_ || null,
        hunter_: this.hunter_ || null,
        prey_: this.prey_ || null,
        brat_tamer_: this.brat_tamer_ || null,
        brat_: this.brat_ || null,
        owner_: this.owner_ || null,
        pet_: this.pet_ || null,
        daddy_mommy_: this.daddy_mommy_ || null,
        little_: this.little_ || null,
        sadist_: this.sadist_ || null,
        masochist_: this.masochist_ || null,
        spanker_: this.spanker_ || null,
        spankee_: this.spankee_ || null,
        degrader_: this.degrader_ || null,
        degradee_: this.degradee_ || null,
        rigger_: this.rigger_ || null,
        rope_bunny_: this.rope_bunny_ || null,
        dominant_: this.dominant_ || null,
        submissive_: this.submissive_ || null,
        switch_: this.switch_ || null,
        vanilla_: this.vanilla_ || null,
      };

      // 데이터 업데이트
      await ref.child(key).update(updatedData);

      console.log("BDSM 데이터가 성공적으로 업데이트되었습니다.");
    } catch (error) {
      console.error("BDSM 데이터 업데이트 오류: ", error.message);
    }
  }
}

class Result {
  constructor(key, tendency, description, type) {
    this.key = key;
    this.tendency = tendency;
    this.description = description;
    this.type = type;
  }

  add() {
    const ref = db.ref("bdsm_results"); // "bdsm" 테이블(참조) 생성
    const newBdsmRef = ref.push(); // 고유 키로 새 데이터 생성
    newBdsmRef.set(this);
  }

  // Firebase에서 데이터를 업데이트하는 메소드
  async update() {
    try {
      const ref = db.ref("bdsm_results"); // Firebase의 "bdsm_results" 노드를 참조

      // Firebase에서 실제 key 값을 기반으로 해당 데이터를 찾습니다.
      const snapshot = await ref
        .orderByChild("key")
        .equalTo(Number(this.key))
        .once("value");

      // 해당 key에 해당하는 데이터가 없으면 에러 처리
      if (!snapshot.exists()) {
        throw new Error("해당 key에 해당하는 데이터가 없습니다.");
      }

      snapshot.forEach(async (childSnapshot) => {
        // 업데이트할 데이터 객체
        const updatedData = {
          tendency: this.tendency || null,
          description: this.description || null,
          type: this.type || null,
        };

        // 해당 key의 데이터를 업데이트
        // `child` 메서드를 이용해 정확한 key로 접근하여 업데이트
        await ref.child(childSnapshot.key).update(updatedData);
      });

      console.log("BDSM 데이터가 성공적으로 업데이트되었습니다.");
    } catch (error) {
      console.error("BDSM 데이터 업데이트 오류: ", error.message);
      throw error; // 호출한 곳에서 에러를 처리할 수 있도록 합니다.
    }
  }
}

class Score {
  constructor({
    id,
    age,
    gender,
    sexual_preferance,
    isAgree,
    master_mistress_total,
    slave_total,
    hunter_total,
    prey_total,
    brat_tamer_total,
    brat_total,
    owner_total,
    pet_total,
    daddy_mommy_total,
    little_total,
    sadist_total,
    masochist_total,
    spanker_total,
    spankee_total,
    degrader_total,
    degradee_total,
    rigger_total,
    rope_bunny_total,
    dominant_total,
    submissive_total,
    switch_total,
    vanilla_total,
  }) {
    this.id = id;
    this.age = age;
    this.gender = gender;
    this.sexual_preferance = sexual_preferance;
    this.isAgree = isAgree;
    this.master_mistress_total = master_mistress_total;
    this.slave_total = slave_total;
    this.hunter_total = hunter_total;
    this.prey_total = prey_total;
    this.brat_tamer_total = brat_tamer_total;
    this.brat_total = brat_total;
    this.owner_total = owner_total;
    this.pet_total = pet_total;
    this.daddy_mommy_total = daddy_mommy_total;
    this.little_total = little_total;
    this.sadist_total = sadist_total;
    this.masochist_total = masochist_total;
    this.spanker_total = spanker_total;
    this.spankee_total = spankee_total;
    this.degrader_total = degrader_total;
    this.degradee_total = degradee_total;
    this.rigger_total = rigger_total;
    this.rope_bunny_total = rope_bunny_total;
    this.dominant_total = dominant_total;
    this.submissive_total = submissive_total;
    this.switch_total = switch_total;
    this.vanilla_total = vanilla_total;
  }

  // 데이터를 Firebase에 추가
  add() {
    const ref = db.ref("bdsm_scores"); // "bdsm_scores" 테이블(참조) 생성
    const newResultRef = ref.push(); // 고유 키로 새 데이터 생성
    newResultRef.set(this);
  }

  // 통계 계산 함수
  static calculateStatistics(data) {
    // 통계 저장 객체 초기화
    const ageGroups = {};
    const genderGroups = {};
    const preferenceGroups = {};

    // 데이터 순회하여 통계 계산
    data.forEach((entry) => {
      // 연령대 통계: 문자열 그대로 비교
      const age = entry.age;
      ageGroups[age] = (ageGroups[age] || 0) + 1;

      // 성별 통계
      const gender = entry.gender;
      if (gender) {
        genderGroups[gender] = (genderGroups[gender] || 0) + 1;
      }

      // 취향 통계
      const sexualPreference = entry.sexual_preferance;
      if (sexualPreference) {
        preferenceGroups[sexualPreference] =
          (preferenceGroups[sexualPreference] || 0) + 1;
      }
    });

    // 결과 객체 반환
    return {
      totalResponses: data.length,
      ageGroups,
      genderGroups,
      preferenceGroups,
    };
  }

  // 나이대별 score 항목별 평균 계산  // 나이대별 평균 계산 함수
  static calculateAgeGroupAverage(data, ageGroup) {
    const ageGroupData = data.filter((entry) => entry.age === ageGroup);

    if (ageGroupData.length === 0) {
      return null; // 해당 나이대에 대한 데이터가 없으면 null 반환
    }

    // 각 항목별 총합을 구한 뒤 평균을 계산
    const averages = {
      "마스터/미스트레스": 0,
      슬레이브: 0,
      헌터: 0,
      프레이: 0,
      브랫테이머: 0,
      브랫: 0,
      오너: 0,
      펫: 0,
      "대디/마미": 0,
      리틀: 0,
      사디스트: 0,
      마조히스트: 0,
      스팽커: 0,
      스팽키: 0,
      디그레이더: 0,
      디그레이디: 0,
      리거: 0,
      로프버니: 0,
      도미넌트: 0,
      서브미시브: 0,
      스위치: 0,
      바닐라: 0,
    };

    // 항목별로 총합을 구하고 데이터 수로 나누기
    ageGroupData.forEach((entry) => {
      averages["마스터/미스트레스"] += entry.master_mistress_total;
      averages.슬레이브 += entry.slave_total;
      averages.헌터 += entry.hunter_total;
      averages.프레이 += entry.prey_total;
      averages.브랫테이머 += entry.brat_tamer_total;
      averages.브랫 += entry.brat_total;
      averages.오너 += entry.owner_total;
      averages.펫 += entry.pet_total;
      averages["대디/마미"] += entry.daddy_mommy_total;
      averages.리틀 += entry.little_total;
      averages.사디스트 += entry.sadist_total;
      averages.마조히스트 += entry.masochist_total;
      averages.스팽커 += entry.spanker_total;
      averages.스팽키 += entry.spankee_total;
      averages.디그레이더 += entry.degrader_total;
      averages.디그레이디 += entry.degradee_total;
      averages.리거 += entry.rigger_total;
      averages.로프버니 += entry.rope_bunny_total;
      averages.도미넌트 += entry.dominant_total;
      averages.서브미시브 += entry.submissive_total;
      averages.스위치 += entry.switch_total;
      averages.바닐라 += entry.vanilla_total;
    });

    // 각 항목에 대해 평균을 구하기
    const numEntries = ageGroupData.length;
    for (const key in averages) {
      averages[key] = averages[key] / numEntries;
    }

    return averages;
  }

  // 성별별 score 항목별 평균 계산 함수
  static calculateGenderGroupAverage(data, genderGroup) {
    // 성별에 맞는 데이터를 필터링
    const genderGroupData = data.filter(
      (entry) => entry.gender === genderGroup
    );

    if (genderGroupData.length === 0) {
      return null; // 해당 성별에 대한 데이터가 없으면 null 반환
    }

    // 각 항목별 총합을 구한 뒤 평균을 계산
    const averages = {
      "마스터/미스트레스": 0,
      슬레이브: 0,
      헌터: 0,
      프레이: 0,
      브랫테이머: 0,
      브랫: 0,
      오너: 0,
      펫: 0,
      "대디/마미": 0,
      리틀: 0,
      사디스트: 0,
      마조히스트: 0,
      스팽커: 0,
      스팽키: 0,
      디그레이더: 0,
      디그레이디: 0,
      리거: 0,
      로프버니: 0,
      도미넌트: 0,
      서브미시브: 0,
      스위치: 0,
      바닐라: 0,
    };

    // 항목별로 총합을 구하고 데이터 수로 나누기
    genderGroupData.forEach((entry) => {
      averages["마스터/미스트레스"] += entry.master_mistress_total;
      averages.슬레이브 += entry.slave_total;
      averages.헌터 += entry.hunter_total;
      averages.프레이 += entry.prey_total;
      averages.브랫테이머 += entry.brat_tamer_total;
      averages.브랫 += entry.brat_total;
      averages.오너 += entry.owner_total;
      averages.펫 += entry.pet_total;
      averages["대디/마미"] += entry.daddy_mommy_total;
      averages.리틀 += entry.little_total;
      averages.사디스트 += entry.sadist_total;
      averages.마조히스트 += entry.masochist_total;
      averages.스팽커 += entry.spanker_total;
      averages.스팽키 += entry.spankee_total;
      averages.디그레이더 += entry.degrader_total;
      averages.디그레이디 += entry.degradee_total;
      averages.리거 += entry.rigger_total;
      averages.로프버니 += entry.rope_bunny_total;
      averages.도미넌트 += entry.dominant_total;
      averages.서브미시브 += entry.submissive_total;
      averages.스위치 += entry.switch_total;
      averages.바닐라 += entry.vanilla_total;
    });

    // 각 항목에 대해 평균을 구하기
    const numEntries = genderGroupData.length;
    for (const key in averages) {
      averages[key] = averages[key] / numEntries;
    }

    return averages;
  }

  // 성적 취향별 score 항목별 평균 계산 함수
  static calculatePreferenceGroupAverage(data, preferenceGroup) {
    // 취향에 맞는 데이터를 필터링
    const preferenceGroupData = data.filter(
      (entry) => entry.sexual_preferance === preferenceGroup
    );

    if (preferenceGroupData.length === 0) {
      return null; // 해당 취향에 대한 데이터가 없으면 null 반환
    }

    // 각 항목별 총합을 구한 뒤 평균을 계산
    const averages = {
      "마스터/미스트레스": 0,
      슬레이브: 0,
      헌터: 0,
      프레이: 0,
      브랫테이머: 0,
      브랫: 0,
      오너: 0,
      펫: 0,
      "대디/마미": 0,
      리틀: 0,
      사디스트: 0,
      마조히스트: 0,
      스팽커: 0,
      스팽키: 0,
      디그레이더: 0,
      디그레이디: 0,
      리거: 0,
      로프버니: 0,
      도미넌트: 0,
      서브미시브: 0,
      스위치: 0,
      바닐라: 0,
    };

    // 항목별로 총합을 구하고 데이터 수로 나누기
    preferenceGroupData.forEach((entry) => {
      averages["마스터/미스트레스"] += entry.master_mistress_total;
      averages.슬레이브 += entry.slave_total;
      averages.헌터 += entry.hunter_total;
      averages.프레이 += entry.prey_total;
      averages.브랫테이머 += entry.brat_tamer_total;
      averages.브랫 += entry.brat_total;
      averages.오너 += entry.owner_total;
      averages.펫 += entry.pet_total;
      averages["대디/마미"] += entry.daddy_mommy_total;
      averages.리틀 += entry.little_total;
      averages.사디스트 += entry.sadist_total;
      averages.마조히스트 += entry.masochist_total;
      averages.스팽커 += entry.spanker_total;
      averages.스팽키 += entry.spankee_total;
      averages.디그레이더 += entry.degrader_total;
      averages.디그레이디 += entry.degradee_total;
      averages.리거 += entry.rigger_total;
      averages.로프버니 += entry.rope_bunny_total;
      averages.도미넌트 += entry.dominant_total;
      averages.서브미시브 += entry.submissive_total;
      averages.스위치 += entry.switch_total;
      averages.바닐라 += entry.vanilla_total;
    });

    // 각 항목에 대해 평균을 구하기
    const numEntries = preferenceGroupData.length;
    for (const key in averages) {
      averages[key] = averages[key] / numEntries;
    }

    return averages;
  }
}

module.exports = { Question, Answer, Result, Score };
