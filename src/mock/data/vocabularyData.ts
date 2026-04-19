// ─── Vocabulary Mock Data ──────────────────────────────────────────────────────

export interface MockWord {
  id: string
  word: string
  phonetic: string
  partOfSpeech: 'noun' | 'verb' | 'adjective' | 'adverb' | 'preposition' | 'phrase'
  meaning: string
  example: string
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'
  status: 'new' | 'learning' | 'mastered'
}

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
    { id: 'w001', word: 'family', phonetic: '/ˈfæmɪli/', partOfSpeech: 'noun', meaning: 'gia đình', example: 'My family lives in Hanoi.', level: 'A1', status: 'mastered' },
    { id: 'w002', word: 'mother', phonetic: '/ˈmʌðər/', partOfSpeech: 'noun', meaning: 'mẹ', example: 'My mother is a teacher.', level: 'A1', status: 'mastered' },
    { id: 'w003', word: 'father', phonetic: '/ˈfɑːðər/', partOfSpeech: 'noun', meaning: 'bố, cha', example: 'My father works in an office.', level: 'A1', status: 'mastered' },
    { id: 'w004', word: 'brother', phonetic: '/ˈbrʌðər/', partOfSpeech: 'noun', meaning: 'anh/em trai', example: 'I have two brothers.', level: 'A1', status: 'mastered' },
    { id: 'w005', word: 'sister', phonetic: '/ˈsɪstər/', partOfSpeech: 'noun', meaning: 'chị/em gái', example: 'My sister is very kind.', level: 'A1', status: 'mastered' },
    { id: 'w006', word: 'grandparent', phonetic: '/ˈɡrændpeərənt/', partOfSpeech: 'noun', meaning: 'ông bà', example: 'I visit my grandparents every weekend.', level: 'A1', status: 'learning' },
    { id: 'w007', word: 'uncle', phonetic: '/ˈʌŋkəl/', partOfSpeech: 'noun', meaning: 'chú, bác, cậu', example: 'My uncle lives in Ho Chi Minh City.', level: 'A1', status: 'learning' },
    { id: 'w008', word: 'aunt', phonetic: '/ɑːnt/', partOfSpeech: 'noun', meaning: 'cô, dì, thím', example: 'My aunt makes delicious food.', level: 'A1', status: 'learning' },
    { id: 'w009', word: 'cousin', phonetic: '/ˈkʌzən/', partOfSpeech: 'noun', meaning: 'anh chị em họ', example: 'I have five cousins.', level: 'A1', status: 'new' },
    { id: 'w010', word: 'relative', phonetic: '/ˈrelətɪv/', partOfSpeech: 'noun', meaning: 'họ hàng, người thân', example: 'All our relatives came to the wedding.', level: 'A1', status: 'new' },
    { id: 'w011', word: 'married', phonetic: '/ˈmærid/', partOfSpeech: 'adjective', meaning: 'đã kết hôn', example: 'My sister got married last year.', level: 'A1', status: 'new' },
    { id: 'w012', word: 'divorced', phonetic: '/dɪˈvɔːrst/', partOfSpeech: 'adjective', meaning: 'đã ly hôn', example: 'His parents are divorced.', level: 'A2', status: 'new' },
  ],

  vs002: [
    { id: 'w101', word: 'red', phonetic: '/red/', partOfSpeech: 'adjective', meaning: 'màu đỏ', example: 'She wore a red dress.', level: 'A1', status: 'new' },
    { id: 'w102', word: 'blue', phonetic: '/bluː/', partOfSpeech: 'adjective', meaning: 'màu xanh lam', example: 'The sky is blue today.', level: 'A1', status: 'new' },
    { id: 'w103', word: 'green', phonetic: '/ɡriːn/', partOfSpeech: 'adjective', meaning: 'màu xanh lá', example: 'The grass is green.', level: 'A1', status: 'new' },
    { id: 'w104', word: 'yellow', phonetic: '/ˈjeloʊ/', partOfSpeech: 'adjective', meaning: 'màu vàng', example: 'Bananas are yellow.', level: 'A1', status: 'new' },
    { id: 'w105', word: 'circle', phonetic: '/ˈsɜːrkəl/', partOfSpeech: 'noun', meaning: 'hình tròn', example: 'Draw a circle on the paper.', level: 'A1', status: 'new' },
    { id: 'w106', word: 'square', phonetic: '/skwer/', partOfSpeech: 'noun', meaning: 'hình vuông', example: 'Cut the paper into a square.', level: 'A1', status: 'new' },
    { id: 'w107', word: 'triangle', phonetic: '/ˈtraɪæŋɡəl/', partOfSpeech: 'noun', meaning: 'hình tam giác', example: 'A triangle has three sides.', level: 'A1', status: 'new' },
    { id: 'w108', word: 'big', phonetic: '/bɪɡ/', partOfSpeech: 'adjective', meaning: 'to, lớn', example: 'That is a big dog!', level: 'A1', status: 'new' },
    { id: 'w109', word: 'small', phonetic: '/smɔːl/', partOfSpeech: 'adjective', meaning: 'nhỏ, bé', example: 'She lives in a small apartment.', level: 'A1', status: 'new' },
    { id: 'w110', word: 'tall', phonetic: '/tɔːl/', partOfSpeech: 'adjective', meaning: 'cao', example: 'He is very tall for his age.', level: 'A1', status: 'new' },
  ],

  vs003: [
    { id: 'w201', word: 'breakfast', phonetic: '/ˈbrekfəst/', partOfSpeech: 'noun', meaning: 'bữa sáng', example: 'I always eat breakfast at 7 am.', level: 'A1', status: 'mastered' },
    { id: 'w202', word: 'lunch', phonetic: '/lʌntʃ/', partOfSpeech: 'noun', meaning: 'bữa trưa', example: 'Let\'s have lunch together.', level: 'A1', status: 'mastered' },
    { id: 'w203', word: 'dinner', phonetic: '/ˈdɪnər/', partOfSpeech: 'noun', meaning: 'bữa tối', example: 'We had dinner at a nice restaurant.', level: 'A1', status: 'mastered' },
    { id: 'w204', word: 'vegetable', phonetic: '/ˈvedʒtəbəl/', partOfSpeech: 'noun', meaning: 'rau củ', example: 'Eat more vegetables to stay healthy.', level: 'A1', status: 'mastered' },
    { id: 'w205', word: 'fruit', phonetic: '/fruːt/', partOfSpeech: 'noun', meaning: 'trái cây', example: 'She eats fruit every morning.', level: 'A1', status: 'mastered' },
    { id: 'w206', word: 'menu', phonetic: '/ˈmenjuː/', partOfSpeech: 'noun', meaning: 'thực đơn', example: 'Can I see the menu please?', level: 'A1', status: 'mastered' },
    { id: 'w207', word: 'delicious', phonetic: '/dɪˈlɪʃəs/', partOfSpeech: 'adjective', meaning: 'ngon, thơm ngon', example: 'This cake is absolutely delicious.', level: 'A2', status: 'learning' },
    { id: 'w208', word: 'spicy', phonetic: '/ˈspaɪsi/', partOfSpeech: 'adjective', meaning: 'cay', example: 'Vietnamese food can be very spicy.', level: 'A2', status: 'learning' },
    { id: 'w209', word: 'ingredient', phonetic: '/ɪnˈɡriːdiənt/', partOfSpeech: 'noun', meaning: 'nguyên liệu, thành phần', example: 'The recipe requires fresh ingredients.', level: 'B1', status: 'learning' },
    { id: 'w210', word: 'recipe', phonetic: '/ˈresɪpi/', partOfSpeech: 'noun', meaning: 'công thức nấu ăn', example: 'My mom gave me her special recipe.', level: 'A2', status: 'new' },
    { id: 'w211', word: 'portion', phonetic: '/ˈpɔːrʃən/', partOfSpeech: 'noun', meaning: 'phần ăn', example: 'The portions here are very large.', level: 'B1', status: 'new' },
    { id: 'w212', word: 'cuisine', phonetic: '/kwɪˈziːn/', partOfSpeech: 'noun', meaning: 'ẩm thực, nền ẩm thực', example: 'Vietnamese cuisine is known worldwide.', level: 'B1', status: 'new' },
    { id: 'w213', word: 'appetizer', phonetic: '/ˈæpɪtaɪzər/', partOfSpeech: 'noun', meaning: 'món khai vị', example: 'We ordered spring rolls as an appetizer.', level: 'B1', status: 'new' },
    { id: 'w214', word: 'beverage', phonetic: '/ˈbevərɪdʒ/', partOfSpeech: 'noun', meaning: 'đồ uống', example: 'What beverage would you like?', level: 'B1', status: 'new' },
    { id: 'w215', word: 'nutritious', phonetic: '/njuːˈtrɪʃəs/', partOfSpeech: 'adjective', meaning: 'bổ dưỡng, giàu dinh dưỡng', example: 'Salads are nutritious and low in calories.', level: 'B2', status: 'new' },
  ],

  vs004: [
    { id: 'w301', word: 'engineer', phonetic: '/ˌendʒɪˈnɪər/', partOfSpeech: 'noun', meaning: 'kỹ sư', example: 'She works as a software engineer.', level: 'A2', status: 'learning' },
    { id: 'w302', word: 'accountant', phonetic: '/əˈkaʊntənt/', partOfSpeech: 'noun', meaning: 'kế toán viên', example: 'He is an accountant at a big firm.', level: 'B1', status: 'learning' },
    { id: 'w303', word: 'manager', phonetic: '/ˈmænɪdʒər/', partOfSpeech: 'noun', meaning: 'quản lý, giám đốc', example: 'The manager approved the new project.', level: 'A2', status: 'learning' },
    { id: 'w304', word: 'colleague', phonetic: '/ˈkɒliːɡ/', partOfSpeech: 'noun', meaning: 'đồng nghiệp', example: 'My colleagues are very supportive.', level: 'B1', status: 'new' },
    { id: 'w305', word: 'salary', phonetic: '/ˈsæləri/', partOfSpeech: 'noun', meaning: 'lương, tiền lương', example: 'Her salary was increased after the review.', level: 'B1', status: 'new' },
    { id: 'w306', word: 'promote', phonetic: '/prəˈmoʊt/', partOfSpeech: 'verb', meaning: 'thăng chức; quảng bá', example: 'He was promoted to senior developer.', level: 'B1', status: 'new' },
    { id: 'w307', word: 'deadline', phonetic: '/ˈdedlaɪn/', partOfSpeech: 'noun', meaning: 'hạn chót, thời hạn', example: 'We must meet the project deadline.', level: 'B1', status: 'new' },
    { id: 'w308', word: 'negotiate', phonetic: '/nɪˈɡoʊʃieɪt/', partOfSpeech: 'verb', meaning: 'đàm phán, thương lượng', example: 'They negotiated a better contract.', level: 'B2', status: 'new' },
    { id: 'w309', word: 'resume', phonetic: '/ˈrezjʊmeɪ/', partOfSpeech: 'noun', meaning: 'hồ sơ xin việc, CV', example: 'Send your resume to the HR department.', level: 'B1', status: 'new' },
    { id: 'w310', word: 'interview', phonetic: '/ˈɪntərvjuː/', partOfSpeech: 'noun', meaning: 'phỏng vấn', example: 'She has a job interview tomorrow.', level: 'A2', status: 'new' },
    { id: 'w311', word: 'qualification', phonetic: '/ˌkwɒlɪfɪˈkeɪʃən/', partOfSpeech: 'noun', meaning: 'bằng cấp, năng lực', example: 'What qualifications do you have?', level: 'B2', status: 'new' },
    { id: 'w312', word: 'resignation', phonetic: '/ˌrezɪɡˈneɪʃən/', partOfSpeech: 'noun', meaning: 'sự từ chức, đơn nghỉ việc', example: 'He submitted his resignation letter.', level: 'B2', status: 'new' },
    { id: 'w313', word: 'overtime', phonetic: '/ˈoʊvərtaɪm/', partOfSpeech: 'noun', meaning: 'tăng ca, làm thêm giờ', example: 'She often works overtime on weekdays.', level: 'B1', status: 'new' },
    { id: 'w314', word: 'outsource', phonetic: '/ˈaʊtsɔːrs/', partOfSpeech: 'verb', meaning: 'thuê ngoài, gia công', example: 'The company outsources IT support.', level: 'B2', status: 'new' },
    { id: 'w315', word: 'entrepreneur', phonetic: '/ˌɒntrəprəˈnɜːr/', partOfSpeech: 'noun', meaning: 'doanh nhân, nhà khởi nghiệp', example: 'She became a successful entrepreneur.', level: 'B2', status: 'new' },
  ],

  vs005: [
    { id: 'w401', word: 'revenue', phonetic: '/ˈrevənjuː/', partOfSpeech: 'noun', meaning: 'doanh thu', example: 'The company\'s revenue grew by 20%.', level: 'B2', status: 'new' },
    { id: 'w402', word: 'profit', phonetic: '/ˈprɒfɪt/', partOfSpeech: 'noun', meaning: 'lợi nhuận', example: 'The profit margin improved this quarter.', level: 'B1', status: 'new' },
    { id: 'w403', word: 'investment', phonetic: '/ɪnˈvestmənt/', partOfSpeech: 'noun', meaning: 'đầu tư', example: 'They are seeking new investment opportunities.', level: 'B2', status: 'new' },
    { id: 'w404', word: 'stakeholder', phonetic: '/ˈsteɪkhoʊldər/', partOfSpeech: 'noun', meaning: 'cổ đông, bên liên quan', example: 'All stakeholders must approve the decision.', level: 'B2', status: 'new' },
    { id: 'w405', word: 'acquisition', phonetic: '/ˌækwɪˈzɪʃən/', partOfSpeech: 'noun', meaning: 'thâu tóm, mua lại', example: 'The acquisition was worth $2 billion.', level: 'C1', status: 'new' },
    { id: 'w406', word: 'merger', phonetic: '/ˈmɜːrdʒər/', partOfSpeech: 'noun', meaning: 'sáp nhập', example: 'The merger created the largest bank in Asia.', level: 'B2', status: 'new' },
    { id: 'w407', word: 'fiscal', phonetic: '/ˈfɪskəl/', partOfSpeech: 'adjective', meaning: 'thuộc tài khóa, tài chính', example: 'The fiscal year ends in December.', level: 'C1', status: 'new' },
    { id: 'w408', word: 'leverage', phonetic: '/ˈlevərɪdʒ/', partOfSpeech: 'noun', meaning: 'đòn bẩy tài chính; lợi thế', example: 'They used financial leverage to expand.', level: 'B2', status: 'new' },
    { id: 'w409', word: 'outsourcing', phonetic: '/ˈaʊtsɔːrsɪŋ/', partOfSpeech: 'noun', meaning: 'thuê ngoài', example: 'Outsourcing reduces operational costs.', level: 'B2', status: 'new' },
    { id: 'w410', word: 'benchmark', phonetic: '/ˈbentʃmɑːrk/', partOfSpeech: 'noun', meaning: 'tiêu chuẩn so sánh, điểm chuẩn', example: 'This KPI is our benchmark for success.', level: 'B2', status: 'new' },
    { id: 'w411', word: 'scalable', phonetic: '/ˈskeɪləbəl/', partOfSpeech: 'adjective', meaning: 'có khả năng mở rộng', example: 'They need a scalable business model.', level: 'C1', status: 'new' },
    { id: 'w412', word: 'forecast', phonetic: '/ˈfɔːrkæst/', partOfSpeech: 'noun', meaning: 'dự báo, dự đoán', example: 'The sales forecast looks promising.', level: 'B1', status: 'new' },
  ],

  vs006: [
    { id: 'w501', word: 'analyze', phonetic: '/ˈænəlaɪz/', partOfSpeech: 'verb', meaning: 'phân tích', example: 'We need to analyze the data carefully.', level: 'B1', status: 'new' },
    { id: 'w502', word: 'hypothesis', phonetic: '/haɪˈpɒθɪsɪs/', partOfSpeech: 'noun', meaning: 'giả thuyết', example: 'The researcher tested the hypothesis.', level: 'C1', status: 'new' },
    { id: 'w503', word: 'methodology', phonetic: '/ˌmeθəˈdɒlədʒi/', partOfSpeech: 'noun', meaning: 'phương pháp luận', example: 'The methodology section explains the research approach.', level: 'C1', status: 'new' },
    { id: 'w504', word: 'implement', phonetic: '/ˈɪmplɪment/', partOfSpeech: 'verb', meaning: 'thực hiện, triển khai', example: 'They implemented new policies last year.', level: 'B2', status: 'new' },
    { id: 'w505', word: 'evaluate', phonetic: '/ɪˈvæljueɪt/', partOfSpeech: 'verb', meaning: 'đánh giá', example: 'Teachers evaluate student performance.', level: 'B1', status: 'new' },
    { id: 'w506', word: 'significant', phonetic: '/sɪɡˈnɪfɪkənt/', partOfSpeech: 'adjective', meaning: 'đáng kể, quan trọng', example: 'There was a significant improvement in results.', level: 'B1', status: 'new' },
    { id: 'w507', word: 'consequently', phonetic: '/ˈkɒnsɪkwəntli/', partOfSpeech: 'adverb', meaning: 'do đó, vì vậy', example: 'He failed the exam; consequently, he retook it.', level: 'B2', status: 'new' },
    { id: 'w508', word: 'furthermore', phonetic: '/ˌfɜːðəˈmɔːr/', partOfSpeech: 'adverb', meaning: 'hơn nữa, thêm vào đó', example: 'Furthermore, the study shows positive results.', level: 'B2', status: 'new' },
    { id: 'w509', word: 'paradigm', phonetic: '/ˈpærədaɪm/', partOfSpeech: 'noun', meaning: 'mô hình, phương thức tư duy', example: 'This research shifts the existing paradigm.', level: 'C1', status: 'new' },
    { id: 'w510', word: 'comprehensive', phonetic: '/ˌkɒmprɪˈhensɪv/', partOfSpeech: 'adjective', meaning: 'toàn diện, đầy đủ', example: 'We conducted a comprehensive review of the literature.', level: 'B2', status: 'new' },
  ],
}
