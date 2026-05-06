// ─── Vocabulary Mock Data ──────────────────────────────────────────────────────

export interface MockWord {
  id: string
  word: string
  phonetic: string
  partOfSpeech: 'noun' | 'verb' | 'adjective' | 'adverb' | 'preposition' | 'phrase'
  meaning: string
  example: string
  audioUrl: string | null
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'
  status: 'new' | 'learning' | 'mastered'
}

const DICT_AUDIO = 'https://api.dictionaryapi.dev/media/pronunciations/en'
function audioUrl(word: string) { return `${DICT_AUDIO}/${word.toLowerCase()}-us.mp3` }

export interface MockVocabSet {
  id: string
  name: string
  description: string
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'
  topic: string
  emoji: string
  wordCount: number
  learnedCount: number
  masteredCount: number
}

// ─── Vocabulary Sets ────────────────────────────────────────────────────────────

export const vocabularySets: MockVocabSet[] = [
  {
    id: 'vs001',
    name: 'Gia đình',
    description: 'Từ vựng về các thành viên trong gia đình và các mối quan hệ thân thiết',
    level: 'A1',
    topic: 'Cuộc sống',
    emoji: '👨‍👩‍👧‍👦',
    wordCount: 12,
    learnedCount: 8,
    masteredCount: 5,
  },
  {
    id: 'vs002',
    name: 'Màu sắc & Hình dạng',
    description: 'Các từ chỉ màu sắc, hình dạng và kích thước cơ bản',
    level: 'A1',
    topic: 'Cơ bản',
    emoji: '🎨',
    wordCount: 10,
    learnedCount: 0,
    masteredCount: 0,
  },
  {
    id: 'vs003',
    name: 'Thức ăn & Đồ uống',
    description: 'Từ vựng về các món ăn, đồ uống và nhà hàng thường gặp',
    level: 'A2',
    topic: 'Ẩm thực',
    emoji: '🍜',
    wordCount: 15,
    learnedCount: 10,
    masteredCount: 6,
  },
  {
    id: 'vs004',
    name: 'Công việc & Nghề nghiệp',
    description: 'Từ vựng mô tả các loại nghề nghiệp và môi trường làm việc',
    level: 'B1',
    topic: 'Nghề nghiệp',
    emoji: '💼',
    wordCount: 15,
    learnedCount: 3,
    masteredCount: 1,
  },
  {
    id: 'vs005',
    name: 'Kinh doanh & Tài chính',
    description: 'Thuật ngữ tiếng Anh thương mại, đàm phán và tài chính doanh nghiệp',
    level: 'B2',
    topic: 'Kinh doanh',
    emoji: '📈',
    wordCount: 12,
    learnedCount: 0,
    masteredCount: 0,
  },
  {
    id: 'vs006',
    name: 'Từ vựng học thuật IELTS',
    description: 'Từ vựng học thuật quan trọng cho IELTS/TOEFL, phù hợp viết luận văn',
    level: 'C1',
    topic: 'Học thuật',
    emoji: '🎓',
    wordCount: 10,
    learnedCount: 0,
    masteredCount: 0,
  },
]

// ─── Words per Set ─────────────────────────────────────────────────────────────

export const vocabularyWords: Record<string, MockWord[]> = {
  vs001: [
    { id: 'w001', word: 'family', phonetic: '/ˈfæmɪli/', partOfSpeech: 'noun', meaning: 'gia đình', example: 'My family lives in Hanoi.', audioUrl: audioUrl('family'), level: 'A1', status: 'mastered' },
    { id: 'w002', word: 'mother', phonetic: '/ˈmʌðər/', partOfSpeech: 'noun', meaning: 'mẹ', example: 'My mother is a teacher.', audioUrl: audioUrl('mother'), level: 'A1', status: 'mastered' },
    { id: 'w003', word: 'father', phonetic: '/ˈfɑːðər/', partOfSpeech: 'noun', meaning: 'bố, cha', example: 'My father works in an office.', audioUrl: audioUrl('father'), level: 'A1', status: 'mastered' },
    { id: 'w004', word: 'brother', phonetic: '/ˈbrʌðər/', partOfSpeech: 'noun', meaning: 'anh/em trai', example: 'I have two brothers.', audioUrl: audioUrl('brother'), level: 'A1', status: 'mastered' },
    { id: 'w005', word: 'sister', phonetic: '/ˈsɪstər/', partOfSpeech: 'noun', meaning: 'chị/em gái', example: 'My sister is very kind.', audioUrl: audioUrl('sister'), level: 'A1', status: 'mastered' },
    { id: 'w006', word: 'grandparent', phonetic: '/ˈɡrændpeərənt/', partOfSpeech: 'noun', meaning: 'ông bà', example: 'I visit my grandparents every weekend.', audioUrl: audioUrl('grandparent'), level: 'A1', status: 'learning' },
    { id: 'w007', word: 'uncle', phonetic: '/ˈʌŋkəl/', partOfSpeech: 'noun', meaning: 'chú, bác, cậu', example: 'My uncle lives in Ho Chi Minh City.', audioUrl: audioUrl('uncle'), level: 'A1', status: 'learning' },
    { id: 'w008', word: 'aunt', phonetic: '/ɑːnt/', partOfSpeech: 'noun', meaning: 'cô, dì, thím', example: 'My aunt makes delicious food.', audioUrl: audioUrl('aunt'), level: 'A1', status: 'learning' },
    { id: 'w009', word: 'cousin', phonetic: '/ˈkʌzən/', partOfSpeech: 'noun', meaning: 'anh chị em họ', example: 'I have five cousins.', audioUrl: audioUrl('cousin'), level: 'A1', status: 'new' },
    { id: 'w010', word: 'relative', phonetic: '/ˈrelətɪv/', partOfSpeech: 'noun', meaning: 'họ hàng, người thân', example: 'All our relatives came to the wedding.', audioUrl: audioUrl('relative'), level: 'A1', status: 'new' },
    { id: 'w011', word: 'married', phonetic: '/ˈmærid/', partOfSpeech: 'adjective', meaning: 'đã kết hôn', example: 'My sister got married last year.', audioUrl: audioUrl('married'), level: 'A1', status: 'new' },
    { id: 'w012', word: 'divorced', phonetic: '/dɪˈvɔːrst/', partOfSpeech: 'adjective', meaning: 'đã ly hôn', example: 'His parents are divorced.', audioUrl: audioUrl('divorced'), level: 'A2', status: 'new' },
  ],

  vs002: [
    { id: 'w101', word: 'red', phonetic: '/red/', partOfSpeech: 'adjective', meaning: 'màu đỏ', example: 'She wore a red dress.', audioUrl: audioUrl('red'), level: 'A1', status: 'new' },
    { id: 'w102', word: 'blue', phonetic: '/bluː/', partOfSpeech: 'adjective', meaning: 'màu xanh lam', example: 'The sky is blue today.', audioUrl: audioUrl('blue'), level: 'A1', status: 'new' },
    { id: 'w103', word: 'green', phonetic: '/ɡriːn/', partOfSpeech: 'adjective', meaning: 'màu xanh lá', example: 'The grass is green.', audioUrl: audioUrl('green'), level: 'A1', status: 'new' },
    { id: 'w104', word: 'yellow', phonetic: '/ˈjeloʊ/', partOfSpeech: 'adjective', meaning: 'màu vàng', example: 'Bananas are yellow.', audioUrl: audioUrl('yellow'), level: 'A1', status: 'new' },
    { id: 'w105', word: 'circle', phonetic: '/ˈsɜːrkəl/', partOfSpeech: 'noun', meaning: 'hình tròn', example: 'Draw a circle on the paper.', audioUrl: audioUrl('circle'), level: 'A1', status: 'new' },
    { id: 'w106', word: 'square', phonetic: '/skwer/', partOfSpeech: 'noun', meaning: 'hình vuông', example: 'Cut the paper into a square.', audioUrl: audioUrl('square'), level: 'A1', status: 'new' },
    { id: 'w107', word: 'triangle', phonetic: '/ˈtraɪæŋɡəl/', partOfSpeech: 'noun', meaning: 'hình tam giác', example: 'A triangle has three sides.', audioUrl: audioUrl('triangle'), level: 'A1', status: 'new' },
    { id: 'w108', word: 'big', phonetic: '/bɪɡ/', partOfSpeech: 'adjective', meaning: 'to, lớn', example: 'That is a big dog!', audioUrl: audioUrl('big'), level: 'A1', status: 'new' },
    { id: 'w109', word: 'small', phonetic: '/smɔːl/', partOfSpeech: 'adjective', meaning: 'nhỏ, bé', example: 'She lives in a small apartment.', audioUrl: audioUrl('small'), level: 'A1', status: 'new' },
    { id: 'w110', word: 'tall', phonetic: '/tɔːl/', partOfSpeech: 'adjective', meaning: 'cao', example: 'He is very tall for his age.', audioUrl: audioUrl('tall'), level: 'A1', status: 'new' },
  ],

  vs003: [
    { id: 'w201', word: 'breakfast', phonetic: '/ˈbrekfəst/', partOfSpeech: 'noun', meaning: 'bữa sáng', example: 'I always eat breakfast at 7 am.', audioUrl: audioUrl('breakfast'), level: 'A1', status: 'mastered' },
    { id: 'w202', word: 'lunch', phonetic: '/lʌntʃ/', partOfSpeech: 'noun', meaning: 'bữa trưa', example: 'Let\'s have lunch together.', audioUrl: audioUrl('lunch'), level: 'A1', status: 'mastered' },
    { id: 'w203', word: 'dinner', phonetic: '/ˈdɪnər/', partOfSpeech: 'noun', meaning: 'bữa tối', example: 'We had dinner at a nice restaurant.', audioUrl: audioUrl('dinner'), level: 'A1', status: 'mastered' },
    { id: 'w204', word: 'vegetable', phonetic: '/ˈvedʒtəbəl/', partOfSpeech: 'noun', meaning: 'rau củ', example: 'Eat more vegetables to stay healthy.', audioUrl: audioUrl('vegetable'), level: 'A1', status: 'mastered' },
    { id: 'w205', word: 'fruit', phonetic: '/fruːt/', partOfSpeech: 'noun', meaning: 'trái cây', example: 'She eats fruit every morning.', audioUrl: audioUrl('fruit'), level: 'A1', status: 'mastered' },
    { id: 'w206', word: 'menu', phonetic: '/ˈmenjuː/', partOfSpeech: 'noun', meaning: 'thực đơn', example: 'Can I see the menu please?', audioUrl: audioUrl('menu'), level: 'A1', status: 'mastered' },
    { id: 'w207', word: 'delicious', phonetic: '/dɪˈlɪʃəs/', partOfSpeech: 'adjective', meaning: 'ngon, thơm ngon', example: 'This cake is absolutely delicious.', audioUrl: audioUrl('delicious'), level: 'A2', status: 'learning' },
    { id: 'w208', word: 'spicy', phonetic: '/ˈspaɪsi/', partOfSpeech: 'adjective', meaning: 'cay', example: 'Vietnamese food can be very spicy.', audioUrl: audioUrl('spicy'), level: 'A2', status: 'learning' },
    { id: 'w209', word: 'ingredient', phonetic: '/ɪnˈɡriːdiənt/', partOfSpeech: 'noun', meaning: 'nguyên liệu, thành phần', example: 'The recipe requires fresh ingredients.', audioUrl: audioUrl('ingredient'), level: 'B1', status: 'learning' },
    { id: 'w210', word: 'recipe', phonetic: '/ˈresɪpi/', partOfSpeech: 'noun', meaning: 'công thức nấu ăn', example: 'My mom gave me her special recipe.', audioUrl: audioUrl('recipe'), level: 'A2', status: 'new' },
    { id: 'w211', word: 'portion', phonetic: '/ˈpɔːrʃən/', partOfSpeech: 'noun', meaning: 'phần ăn', example: 'The portions here are very large.', audioUrl: audioUrl('portion'), level: 'B1', status: 'new' },
    { id: 'w212', word: 'cuisine', phonetic: '/kwɪˈziːn/', partOfSpeech: 'noun', meaning: 'ẩm thực, nền ẩm thực', example: 'Vietnamese cuisine is known worldwide.', audioUrl: audioUrl('cuisine'), level: 'B1', status: 'new' },
    { id: 'w213', word: 'appetizer', phonetic: '/ˈæpɪtaɪzər/', partOfSpeech: 'noun', meaning: 'món khai vị', example: 'We ordered spring rolls as an appetizer.', audioUrl: audioUrl('appetizer'), level: 'B1', status: 'new' },
    { id: 'w214', word: 'beverage', phonetic: '/ˈbevərɪdʒ/', partOfSpeech: 'noun', meaning: 'đồ uống', example: 'What beverage would you like?', audioUrl: audioUrl('beverage'), level: 'B1', status: 'new' },
    { id: 'w215', word: 'nutritious', phonetic: '/njuːˈtrɪʃəs/', partOfSpeech: 'adjective', meaning: 'bổ dưỡng, giàu dinh dưỡng', example: 'Salads are nutritious and low in calories.', audioUrl: audioUrl('nutritious'), level: 'B2', status: 'new' },
  ],

  vs004: [
    { id: 'w301', word: 'engineer', phonetic: '/ˌendʒɪˈnɪər/', partOfSpeech: 'noun', meaning: 'kỹ sư', example: 'She works as a software engineer.', audioUrl: audioUrl('engineer'), level: 'A2', status: 'learning' },
    { id: 'w302', word: 'accountant', phonetic: '/əˈkaʊntənt/', partOfSpeech: 'noun', meaning: 'kế toán viên', example: 'He is an accountant at a big firm.', audioUrl: audioUrl('accountant'), level: 'B1', status: 'learning' },
    { id: 'w303', word: 'manager', phonetic: '/ˈmænɪdʒər/', partOfSpeech: 'noun', meaning: 'quản lý, giám đốc', example: 'The manager approved the new project.', audioUrl: audioUrl('manager'), level: 'A2', status: 'learning' },
    { id: 'w304', word: 'colleague', phonetic: '/ˈkɒliːɡ/', partOfSpeech: 'noun', meaning: 'đồng nghiệp', example: 'My colleagues are very supportive.', audioUrl: audioUrl('colleague'), level: 'B1', status: 'new' },
    { id: 'w305', word: 'salary', phonetic: '/ˈsæləri/', partOfSpeech: 'noun', meaning: 'lương, tiền lương', example: 'Her salary was increased after the review.', audioUrl: audioUrl('salary'), level: 'B1', status: 'new' },
    { id: 'w306', word: 'promote', phonetic: '/prəˈmoʊt/', partOfSpeech: 'verb', meaning: 'thăng chức; quảng bá', example: 'He was promoted to senior developer.', audioUrl: audioUrl('promote'), level: 'B1', status: 'new' },
    { id: 'w307', word: 'deadline', phonetic: '/ˈdedlaɪn/', partOfSpeech: 'noun', meaning: 'hạn chót, thời hạn', example: 'We must meet the project deadline.', audioUrl: audioUrl('deadline'), level: 'B1', status: 'new' },
    { id: 'w308', word: 'negotiate', phonetic: '/nɪˈɡoʊʃieɪt/', partOfSpeech: 'verb', meaning: 'đàm phán, thương lượng', example: 'They negotiated a better contract.', audioUrl: audioUrl('negotiate'), level: 'B2', status: 'new' },
    { id: 'w309', word: 'resume', phonetic: '/ˈrezjʊmeɪ/', partOfSpeech: 'noun', meaning: 'hồ sơ xin việc, CV', example: 'Send your resume to the HR department.', audioUrl: audioUrl('resume'), level: 'B1', status: 'new' },
    { id: 'w310', word: 'interview', phonetic: '/ˈɪntərvjuː/', partOfSpeech: 'noun', meaning: 'phỏng vấn', example: 'She has a job interview tomorrow.', audioUrl: audioUrl('interview'), level: 'A2', status: 'new' },
    { id: 'w311', word: 'qualification', phonetic: '/ˌkwɒlɪfɪˈkeɪʃən/', partOfSpeech: 'noun', meaning: 'bằng cấp, năng lực', example: 'What qualifications do you have?', audioUrl: audioUrl('qualification'), level: 'B2', status: 'new' },
    { id: 'w312', word: 'resignation', phonetic: '/ˌrezɪɡˈneɪʃən/', partOfSpeech: 'noun', meaning: 'sự từ chức, đơn nghỉ việc', example: 'He submitted his resignation letter.', audioUrl: audioUrl('resignation'), level: 'B2', status: 'new' },
    { id: 'w313', word: 'overtime', phonetic: '/ˈoʊvərtaɪm/', partOfSpeech: 'noun', meaning: 'tăng ca, làm thêm giờ', example: 'She often works overtime on weekdays.', audioUrl: audioUrl('overtime'), level: 'B1', status: 'new' },
    { id: 'w314', word: 'outsource', phonetic: '/ˈaʊtsɔːrs/', partOfSpeech: 'verb', meaning: 'thuê ngoài, gia công', example: 'The company outsources IT support.', audioUrl: audioUrl('outsource'), level: 'B2', status: 'new' },
    { id: 'w315', word: 'entrepreneur', phonetic: '/ˌɒntrəprəˈnɜːr/', partOfSpeech: 'noun', meaning: 'doanh nhân, nhà khởi nghiệp', example: 'She became a successful entrepreneur.', audioUrl: audioUrl('entrepreneur'), level: 'B2', status: 'new' },
  ],

  vs005: [
    { id: 'w401', word: 'revenue', phonetic: '/ˈrevənjuː/', partOfSpeech: 'noun', meaning: 'doanh thu', example: 'The company\'s revenue grew by 20%.', audioUrl: audioUrl('revenue'), level: 'B2', status: 'new' },
    { id: 'w402', word: 'profit', phonetic: '/ˈprɒfɪt/', partOfSpeech: 'noun', meaning: 'lợi nhuận', example: 'The profit margin improved this quarter.', audioUrl: audioUrl('profit'), level: 'B1', status: 'new' },
    { id: 'w403', word: 'investment', phonetic: '/ɪnˈvestmənt/', partOfSpeech: 'noun', meaning: 'đầu tư', example: 'They are seeking new investment opportunities.', audioUrl: audioUrl('investment'), level: 'B2', status: 'new' },
    { id: 'w404', word: 'stakeholder', phonetic: '/ˈsteɪkhoʊldər/', partOfSpeech: 'noun', meaning: 'cổ đông, bên liên quan', example: 'All stakeholders must approve the decision.', audioUrl: audioUrl('stakeholder'), level: 'B2', status: 'new' },
    { id: 'w405', word: 'acquisition', phonetic: '/ˌækwɪˈzɪʃən/', partOfSpeech: 'noun', meaning: 'thâu tóm, mua lại', example: 'The acquisition was worth $2 billion.', audioUrl: audioUrl('acquisition'), level: 'C1', status: 'new' },
    { id: 'w406', word: 'merger', phonetic: '/ˈmɜːrdʒər/', partOfSpeech: 'noun', meaning: 'sáp nhập', example: 'The merger created the largest bank in Asia.', audioUrl: audioUrl('merger'), level: 'B2', status: 'new' },
    { id: 'w407', word: 'fiscal', phonetic: '/ˈfɪskəl/', partOfSpeech: 'adjective', meaning: 'thuộc tài khóa, tài chính', example: 'The fiscal year ends in December.', audioUrl: audioUrl('fiscal'), level: 'C1', status: 'new' },
    { id: 'w408', word: 'leverage', phonetic: '/ˈlevərɪdʒ/', partOfSpeech: 'noun', meaning: 'đòn bẩy tài chính; lợi thế', example: 'They used financial leverage to expand.', audioUrl: audioUrl('leverage'), level: 'B2', status: 'new' },
    { id: 'w409', word: 'outsourcing', phonetic: '/ˈaʊtsɔːrsɪŋ/', partOfSpeech: 'noun', meaning: 'thuê ngoài', example: 'Outsourcing reduces operational costs.', audioUrl: audioUrl('outsourcing'), level: 'B2', status: 'new' },
    { id: 'w410', word: 'benchmark', phonetic: '/ˈbentʃmɑːrk/', partOfSpeech: 'noun', meaning: 'tiêu chuẩn so sánh, điểm chuẩn', example: 'This KPI is our benchmark for success.', audioUrl: audioUrl('benchmark'), level: 'B2', status: 'new' },
    { id: 'w411', word: 'scalable', phonetic: '/ˈskeɪləbəl/', partOfSpeech: 'adjective', meaning: 'có khả năng mở rộng', example: 'They need a scalable business model.', audioUrl: audioUrl('scalable'), level: 'C1', status: 'new' },
    { id: 'w412', word: 'forecast', phonetic: '/ˈfɔːrkæst/', partOfSpeech: 'noun', meaning: 'dự báo, dự đoán', example: 'The sales forecast looks promising.', audioUrl: audioUrl('forecast'), level: 'B1', status: 'new' },
  ],

  vs006: [
    { id: 'w501', word: 'analyze', phonetic: '/ˈænəlaɪz/', partOfSpeech: 'verb', meaning: 'phân tích', example: 'We need to analyze the data carefully.', audioUrl: audioUrl('analyze'), level: 'B1', status: 'new' },
    { id: 'w502', word: 'hypothesis', phonetic: '/haɪˈpɒθɪsɪs/', partOfSpeech: 'noun', meaning: 'giả thuyết', example: 'The researcher tested the hypothesis.', audioUrl: audioUrl('hypothesis'), level: 'C1', status: 'new' },
    { id: 'w503', word: 'methodology', phonetic: '/ˌmeθəˈdɒlədʒi/', partOfSpeech: 'noun', meaning: 'phương pháp luận', example: 'The methodology section explains the research approach.', audioUrl: audioUrl('methodology'), level: 'C1', status: 'new' },
    { id: 'w504', word: 'implement', phonetic: '/ˈɪmplɪment/', partOfSpeech: 'verb', meaning: 'thực hiện, triển khai', example: 'They implemented new policies last year.', audioUrl: audioUrl('implement'), level: 'B2', status: 'new' },
    { id: 'w505', word: 'evaluate', phonetic: '/ɪˈvæljueɪt/', partOfSpeech: 'verb', meaning: 'đánh giá', example: 'Teachers evaluate student performance.', audioUrl: audioUrl('evaluate'), level: 'B1', status: 'new' },
    { id: 'w506', word: 'significant', phonetic: '/sɪɡˈnɪfɪkənt/', partOfSpeech: 'adjective', meaning: 'đáng kể, quan trọng', example: 'There was a significant improvement in results.', audioUrl: audioUrl('significant'), level: 'B1', status: 'new' },
    { id: 'w507', word: 'consequently', phonetic: '/ˈkɒnsɪkwəntli/', partOfSpeech: 'adverb', meaning: 'do đó, vì vậy', example: 'He failed the exam; consequently, he retook it.', audioUrl: audioUrl('consequently'), level: 'B2', status: 'new' },
    { id: 'w508', word: 'furthermore', phonetic: '/ˌfɜːðəˈmɔːr/', partOfSpeech: 'adverb', meaning: 'hơn nữa, thêm vào đó', example: 'Furthermore, the study shows positive results.', audioUrl: audioUrl('furthermore'), level: 'B2', status: 'new' },
    { id: 'w509', word: 'paradigm', phonetic: '/ˈpærədaɪm/', partOfSpeech: 'noun', meaning: 'mô hình, phương thức tư duy', example: 'This research shifts the existing paradigm.', audioUrl: audioUrl('paradigm'), level: 'C1', status: 'new' },
    { id: 'w510', word: 'comprehensive', phonetic: '/ˌkɒmprɪˈhensɪv/', partOfSpeech: 'adjective', meaning: 'toàn diện, đầy đủ', example: 'We conducted a comprehensive review of the literature.', audioUrl: audioUrl('comprehensive'), level: 'B2', status: 'new' },
  ],
}
