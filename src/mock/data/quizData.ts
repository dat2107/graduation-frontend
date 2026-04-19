// ─── Quiz Mock Data ────────────────────────────────────────────────────────────

export type MockQuestionType = 'multiple_choice' | 'true_false'

export interface MockOption {
  id: string
  text: string
}

export interface MockQuestion {
  id: string
  quizId: string
  order: number
  type: MockQuestionType
  questionText: string
  options: MockOption[]
  correctOptionId: string
  explanation: string
}

export interface MockQuiz {
  id: string
  title: string
  description: string
  topic: string
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1'
  emoji: string
  questionCount: number
  durationMinutes: number
  difficulty: 'easy' | 'medium' | 'hard'
  completedCount: number   // số lần user đã làm
  bestScore: number | null // điểm cao nhất (null = chưa làm)
}

// ─── Quiz List ─────────────────────────────────────────────────────────────────

export const quizList: MockQuiz[] = [
  {
    id: 'q001',
    title: 'Từ vựng A1 — Gia đình & Bạn bè',
    description: 'Kiểm tra từ vựng về các thành viên gia đình và các mối quan hệ cơ bản',
    topic: 'Từ vựng',
    level: 'A1',
    emoji: '👨‍👩‍👧',
    questionCount: 10,
    durationMinutes: 10,
    difficulty: 'easy',
    completedCount: 2,
    bestScore: 80,
  },
  {
    id: 'q002',
    title: 'Từ vựng A2 — Thức ăn & Ẩm thực',
    description: 'Kiểm tra từ vựng về món ăn, đồ uống và nhà hàng',
    topic: 'Từ vựng',
    level: 'A2',
    emoji: '🍜',
    questionCount: 10,
    durationMinutes: 10,
    difficulty: 'easy',
    completedCount: 0,
    bestScore: null,
  },
  {
    id: 'q003',
    title: 'Ngữ pháp — Thì Hiện tại đơn',
    description: 'Bài kiểm tra về cấu trúc và cách dùng thì Present Simple',
    topic: 'Ngữ pháp',
    level: 'A1',
    emoji: '📝',
    questionCount: 10,
    durationMinutes: 15,
    difficulty: 'medium',
    completedCount: 1,
    bestScore: 70,
  },
  {
    id: 'q004',
    title: 'Từ vựng B1 — Công việc & Nghề nghiệp',
    description: 'Kiểm tra từ vựng về các loại nghề nghiệp và môi trường làm việc',
    topic: 'Từ vựng',
    level: 'B1',
    emoji: '💼',
    questionCount: 12,
    durationMinutes: 15,
    difficulty: 'medium',
    completedCount: 0,
    bestScore: null,
  },
  {
    id: 'q005',
    title: 'Luyện thi IELTS — Academic Vocabulary',
    description: 'Từ vựng học thuật cấp độ C1 thường gặp trong IELTS Academic',
    topic: 'IELTS',
    level: 'C1',
    emoji: '🎓',
    questionCount: 10,
    durationMinutes: 20,
    difficulty: 'hard',
    completedCount: 0,
    bestScore: null,
  },
]

// ─── Questions per Quiz ────────────────────────────────────────────────────────

export const quizQuestions: Record<string, MockQuestion[]> = {
  q001: [
    {
      id: 'q001_1', quizId: 'q001', order: 1, type: 'multiple_choice',
      questionText: '"Mẹ" trong tiếng Anh là gì?',
      options: [{ id: 'a', text: 'Father' }, { id: 'b', text: 'Sister' }, { id: 'c', text: 'Mother' }, { id: 'd', text: 'Aunt' }],
      correctOptionId: 'c',
      explanation: '"Mother" nghĩa là mẹ. "Father" = bố, "Sister" = chị/em gái, "Aunt" = cô/dì.',
    },
    {
      id: 'q001_2', quizId: 'q001', order: 2, type: 'multiple_choice',
      questionText: 'Chọn từ đúng nghĩa với "anh/em trai":',
      options: [{ id: 'a', text: 'Cousin' }, { id: 'b', text: 'Uncle' }, { id: 'c', text: 'Brother' }, { id: 'd', text: 'Nephew' }],
      correctOptionId: 'c',
      explanation: '"Brother" = anh/em trai. "Cousin" = anh/chị/em họ, "Uncle" = chú/bác, "Nephew" = cháu trai.',
    },
    {
      id: 'q001_3', quizId: 'q001', order: 3, type: 'true_false',
      questionText: '"Grandparent" là từ để chỉ anh/em họ của bạn.',
      options: [{ id: 'true', text: '✅ Đúng' }, { id: 'false', text: '❌ Sai' }],
      correctOptionId: 'false',
      explanation: '"Grandparent" nghĩa là ông/bà (bố mẹ của bố/mẹ). Anh/em họ là "cousin".',
    },
    {
      id: 'q001_4', quizId: 'q001', order: 4, type: 'multiple_choice',
      questionText: 'Câu nào đúng ngữ pháp?',
      options: [
        { id: 'a', text: 'My family lives in Hanoi.' },
        { id: 'b', text: 'My family live in Hanoi.' },
        { id: 'c', text: 'My family are living in Hanoi.' },
        { id: 'd', text: 'My family is lived in Hanoi.' },
      ],
      correctOptionId: 'a',
      explanation: '"Family" là danh từ tập hợp (collective noun), thường dùng với động từ số ít trong tiếng Anh Mỹ.',
    },
    {
      id: 'q001_5', quizId: 'q001', order: 5, type: 'multiple_choice',
      questionText: '"She has two ___." — Điền từ thích hợp về chị/em gái:',
      options: [{ id: 'a', text: 'brothers' }, { id: 'b', text: 'sisters' }, { id: 'c', text: 'cousins' }, { id: 'd', text: 'aunts' }],
      correctOptionId: 'b',
      explanation: '"Sister" = chị/em gái. Câu hoàn chỉnh: "She has two sisters."',
    },
    {
      id: 'q001_6', quizId: 'q001', order: 6, type: 'true_false',
      questionText: '"Uncle" có thể là anh/em trai của bố hoặc mẹ bạn.',
      options: [{ id: 'true', text: '✅ Đúng' }, { id: 'false', text: '❌ Sai' }],
      correctOptionId: 'true',
      explanation: 'Đúng! "Uncle" = chú/bác/cậu — tức là anh/em trai của bố hoặc mẹ.',
    },
    {
      id: 'q001_7', quizId: 'q001', order: 7, type: 'multiple_choice',
      questionText: '"My parents got ___ last year." — Điền từ về kết hôn:',
      options: [{ id: 'a', text: 'divorced' }, { id: 'b', text: 'married' }, { id: 'c', text: 'relative' }, { id: 'd', text: 'single' }],
      correctOptionId: 'b',
      explanation: '"Get married" = kết hôn. "Get divorced" = ly hôn. Ngữ cảnh "last year" gợi ý đây là sự kiện tích cực.',
    },
    {
      id: 'q001_8', quizId: 'q001', order: 8, type: 'multiple_choice',
      questionText: 'Con gái của aunt hoặc uncle của bạn được gọi là gì?',
      options: [{ id: 'a', text: 'Niece' }, { id: 'b', text: 'Nephew' }, { id: 'c', text: 'Cousin' }, { id: 'd', text: 'Relative' }],
      correctOptionId: 'c',
      explanation: 'Con của chú/bác/cô/dì là "cousin" (anh/chị/em họ), không phân biệt giới tính.',
    },
    {
      id: 'q001_9', quizId: 'q001', order: 9, type: 'true_false',
      questionText: '"Relative" chỉ có nghĩa là người thân trong gia đình hạt nhân (bố, mẹ, anh, chị, em).',
      options: [{ id: 'true', text: '✅ Đúng' }, { id: 'false', text: '❌ Sai' }],
      correctOptionId: 'false',
      explanation: 'Sai! "Relative" nghĩa là họ hàng nói chung, bao gồm cả họ hàng xa như cô, chú, anh/chị em họ...',
    },
    {
      id: 'q001_10', quizId: 'q001', order: 10, type: 'multiple_choice',
      questionText: '"I visit my ___ every weekend." — Ai là người bạn thường thăm?',
      options: [
        { id: 'a', text: 'grandparents' },
        { id: 'b', text: 'strangers' },
        { id: 'c', text: 'colleagues' },
        { id: 'd', text: 'neighbors' },
      ],
      correctOptionId: 'a',
      explanation: 'Ngữ cảnh "every weekend" phù hợp nhất với việc thăm "grandparents" (ông bà).',
    },
  ],

  q002: [
    {
      id: 'q002_1', quizId: 'q002', order: 1, type: 'multiple_choice',
      questionText: '"Bữa sáng" trong tiếng Anh là gì?',
      options: [{ id: 'a', text: 'Lunch' }, { id: 'b', text: 'Dinner' }, { id: 'c', text: 'Brunch' }, { id: 'd', text: 'Breakfast' }],
      correctOptionId: 'd',
      explanation: '"Breakfast" = bữa sáng. "Lunch" = bữa trưa, "Dinner" = bữa tối, "Brunch" = bữa ăn giữa sáng và trưa.',
    },
    {
      id: 'q002_2', quizId: 'q002', order: 2, type: 'true_false',
      questionText: '"Delicious" và "tasty" đều có nghĩa là ngon.',
      options: [{ id: 'true', text: '✅ Đúng' }, { id: 'false', text: '❌ Sai' }],
      correctOptionId: 'true',
      explanation: 'Đúng! Cả "delicious" và "tasty" đều nghĩa là ngon, có thể dùng thay nhau trong hầu hết ngữ cảnh.',
    },
    {
      id: 'q002_3', quizId: 'q002', order: 3, type: 'multiple_choice',
      questionText: '"The food is too ___." — Điền từ để nói đồ ăn quá cay:',
      options: [{ id: 'a', text: 'sweet' }, { id: 'b', text: 'sour' }, { id: 'c', text: 'spicy' }, { id: 'd', text: 'bitter' }],
      correctOptionId: 'c',
      explanation: '"Spicy" = cay. "Sweet" = ngọt, "Sour" = chua, "Bitter" = đắng.',
    },
    {
      id: 'q002_4', quizId: 'q002', order: 4, type: 'multiple_choice',
      questionText: '"Can I see the ___ please?" — Bạn yêu cầu thứ gì ở nhà hàng?',
      options: [{ id: 'a', text: 'recipe' }, { id: 'b', text: 'menu' }, { id: 'c', text: 'ingredient' }, { id: 'd', text: 'portion' }],
      correctOptionId: 'b',
      explanation: '"Menu" = thực đơn. Đây là câu nói thông thường khi vào nhà hàng.',
    },
    {
      id: 'q002_5', quizId: 'q002', order: 5, type: 'multiple_choice',
      questionText: 'Chọn nhóm từ là "vegetables" (rau củ):',
      options: [
        { id: 'a', text: 'Apple, banana, mango' },
        { id: 'b', text: 'Chicken, beef, pork' },
        { id: 'c', text: 'Carrot, spinach, broccoli' },
        { id: 'd', text: 'Rice, bread, pasta' },
      ],
      correctOptionId: 'c',
      explanation: 'Carrot (cà rốt), spinach (rau bina), broccoli (bông cải xanh) đều là rau củ.',
    },
    {
      id: 'q002_6', quizId: 'q002', order: 6, type: 'true_false',
      questionText: '"Cuisine" và "food" có nghĩa hoàn toàn giống nhau.',
      options: [{ id: 'true', text: '✅ Đúng' }, { id: 'false', text: '❌ Sai' }],
      correctOptionId: 'false',
      explanation: 'Không hoàn toàn giống. "Cuisine" mang nghĩa rộng hơn — chỉ phong cách/nền ẩm thực (vd: Vietnamese cuisine). "Food" chỉ đơn giản là đồ ăn.',
    },
    {
      id: 'q002_7', quizId: 'q002', order: 7, type: 'multiple_choice',
      questionText: '"The recipe requires fresh ___." — Điền từ đúng:',
      options: [{ id: 'a', text: 'menus' }, { id: 'b', text: 'portions' }, { id: 'c', text: 'ingredients' }, { id: 'd', text: 'beverages' }],
      correctOptionId: 'c',
      explanation: '"Ingredient" = nguyên liệu. Công thức nấu ăn cần nguyên liệu tươi.',
    },
    {
      id: 'q002_8', quizId: 'q002', order: 8, type: 'multiple_choice',
      questionText: '"The ___ here are very generous." — Ý nói phần ăn ở đây nhiều:',
      options: [{ id: 'a', text: 'prices' }, { id: 'b', text: 'portions' }, { id: 'c', text: 'flavors' }, { id: 'd', text: 'courses' }],
      correctOptionId: 'b',
      explanation: '"Portion" = phần ăn. "Generous portions" nghĩa là phần ăn hào phóng/nhiều.',
    },
    {
      id: 'q002_9', quizId: 'q002', order: 9, type: 'multiple_choice',
      questionText: 'Chọn từ đồng nghĩa với "nutritious":',
      options: [{ id: 'a', text: 'Healthy and nourishing' }, { id: 'b', text: 'Tasty and spicy' }, { id: 'c', text: 'Cheap and filling' }, { id: 'd', text: 'Sweet and sour' }],
      correctOptionId: 'a',
      explanation: '"Nutritious" = bổ dưỡng = healthy (tốt cho sức khỏe) và nourishing (cung cấp dinh dưỡng).',
    },
    {
      id: 'q002_10', quizId: 'q002', order: 10, type: 'true_false',
      questionText: '"Appetizer" là món được phục vụ sau bữa ăn chính.',
      options: [{ id: 'true', text: '✅ Đúng' }, { id: 'false', text: '❌ Sai' }],
      correctOptionId: 'false',
      explanation: 'Sai! "Appetizer" = món khai vị, được phục vụ TRƯỚC bữa ăn chính. Món sau bữa chính là "dessert" (tráng miệng).',
    },
  ],

  q003: [
    {
      id: 'q003_1', quizId: 'q003', order: 1, type: 'multiple_choice',
      questionText: 'Chọn câu đúng với thì Hiện tại đơn (He/She/It):',
      options: [
        { id: 'a', text: 'She go to school every day.' },
        { id: 'b', text: 'She goes to school every day.' },
        { id: 'c', text: 'She going to school every day.' },
        { id: 'd', text: 'She is go to school every day.' },
      ],
      correctOptionId: 'b',
      explanation: 'Với chủ ngữ She/He/It, động từ thêm "-s" hoặc "-es". "go" → "goes".',
    },
    {
      id: 'q003_2', quizId: 'q003', order: 2, type: 'true_false',
      questionText: 'Thì Hiện tại đơn có thể diễn tả thói quen và sự thật hiển nhiên.',
      options: [{ id: 'true', text: '✅ Đúng' }, { id: 'false', text: '❌ Sai' }],
      correctOptionId: 'true',
      explanation: 'Đúng! Present Simple dùng để diễn tả: thói quen (I eat breakfast every day), sự thật (The sun rises in the east).',
    },
    {
      id: 'q003_3', quizId: 'q003', order: 3, type: 'multiple_choice',
      questionText: '"He ___ not like spicy food." — Điền trợ động từ đúng:',
      options: [{ id: 'a', text: 'do' }, { id: 'b', text: 'does' }, { id: 'c', text: 'is' }, { id: 'd', text: 'are' }],
      correctOptionId: 'b',
      explanation: 'He/She/It dùng "does not" (doesn\'t) ở dạng phủ định. "Do not" dùng với I/You/We/They.',
    },
    {
      id: 'q003_4', quizId: 'q003', order: 4, type: 'multiple_choice',
      questionText: '"___ she speak English?" — Điền trợ động từ để hỏi:',
      options: [{ id: 'a', text: 'Do' }, { id: 'b', text: 'Does' }, { id: 'c', text: 'Is' }, { id: 'd', text: 'Has' }],
      correctOptionId: 'b',
      explanation: 'Câu hỏi Yes/No với He/She/It dùng "Does + S + V(bare)?". "Does she speak...?"',
    },
    {
      id: 'q003_5', quizId: 'q003', order: 5, type: 'true_false',
      questionText: '"They studies English every evening." — Câu này đúng ngữ pháp.',
      options: [{ id: 'true', text: '✅ Đúng' }, { id: 'false', text: '❌ Sai' }],
      correctOptionId: 'false',
      explanation: 'Sai! "They" là chủ ngữ số nhiều, dùng động từ nguyên mẫu không thêm -s. Đúng: "They study English every evening."',
    },
    {
      id: 'q003_6', quizId: 'q003', order: 6, type: 'multiple_choice',
      questionText: 'Động từ nào cần thêm "-es" với He/She/It?',
      options: [{ id: 'a', text: 'work' }, { id: 'b', text: 'play' }, { id: 'c', text: 'teach' }, { id: 'd', text: 'learn' }],
      correctOptionId: 'c',
      explanation: '"Teach" kết thúc bằng "-ch" nên thêm "-es": teaches. Các động từ còn lại chỉ thêm "-s": works, plays, learns.',
    },
    {
      id: 'q003_7', quizId: 'q003', order: 7, type: 'multiple_choice',
      questionText: '"Water ___ at 100 degrees Celsius." — Sự thật hiển nhiên:',
      options: [{ id: 'a', text: 'is boiling' }, { id: 'b', text: 'boiled' }, { id: 'c', text: 'boils' }, { id: 'd', text: 'has boiled' }],
      correctOptionId: 'c',
      explanation: 'Sự thật hiển nhiên (scientific facts) dùng Present Simple: "Water boils at 100°C."',
    },
    {
      id: 'q003_8', quizId: 'q003', order: 8, type: 'multiple_choice',
      questionText: 'Chọn câu dùng Present Simple ĐÚNG mục đích:',
      options: [
        { id: 'a', text: 'I am studying right now.' },
        { id: 'b', text: 'She usually drinks coffee in the morning.' },
        { id: 'c', text: 'They are playing football at the moment.' },
        { id: 'd', text: 'He is sleeping now.' },
      ],
      correctOptionId: 'b',
      explanation: '"Usually" là dấu hiệu của Present Simple (thói quen). Các câu khác dùng "right now / at the moment" → Present Continuous.',
    },
    {
      id: 'q003_9', quizId: 'q003', order: 9, type: 'true_false',
      questionText: 'Với câu hỏi Yes/No: "Do you like coffee?" — Trả lời đúng là "Yes, I likes."',
      options: [{ id: 'true', text: '✅ Đúng' }, { id: 'false', text: '❌ Sai' }],
      correctOptionId: 'false',
      explanation: 'Sai! Trả lời ngắn đúng là "Yes, I do." — không dùng "likes" với "I".',
    },
    {
      id: 'q003_10', quizId: 'q003', order: 10, type: 'multiple_choice',
      questionText: '"He ___ to the gym three times a week." — Điền động từ đúng:',
      options: [{ id: 'a', text: 'go' }, { id: 'b', text: 'gos' }, { id: 'c', text: 'goes' }, { id: 'd', text: 'going' }],
      correctOptionId: 'c',
      explanation: '"He" → thêm "-es": "goes". "Three times a week" là tần suất → Present Simple.',
    },
  ],

  q004: [
    {
      id: 'q004_1', quizId: 'q004', order: 1, type: 'multiple_choice',
      questionText: '"Người đồng nghiệp" tiếng Anh là gì?',
      options: [{ id: 'a', text: 'Client' }, { id: 'b', text: 'Colleague' }, { id: 'c', text: 'Manager' }, { id: 'd', text: 'Employee' }],
      correctOptionId: 'b',
      explanation: '"Colleague" = đồng nghiệp. "Client" = khách hàng, "Manager" = quản lý, "Employee" = nhân viên.',
    },
    {
      id: 'q004_2', quizId: 'q004', order: 2, type: 'multiple_choice',
      questionText: '"She was ___ to senior developer last month." — Điền từ về thăng chức:',
      options: [{ id: 'a', text: 'hired' }, { id: 'b', text: 'fired' }, { id: 'c', text: 'promoted' }, { id: 'd', text: 'resigned' }],
      correctOptionId: 'c',
      explanation: '"Promote" = thăng chức. "Hire" = tuyển dụng, "Fire" = sa thải, "Resign" = từ chức.',
    },
    {
      id: 'q004_3', quizId: 'q004', order: 3, type: 'true_false',
      questionText: '"Deadline" là thời điểm sớm nhất bạn có thể nộp bài.',
      options: [{ id: 'true', text: '✅ Đúng' }, { id: 'false', text: '❌ Sai' }],
      correctOptionId: 'false',
      explanation: 'Sai! "Deadline" = hạn chót, thời điểm MUỘN NHẤT phải hoàn thành công việc.',
    },
    {
      id: 'q004_4', quizId: 'q004', order: 4, type: 'multiple_choice',
      questionText: '"Hồ sơ xin việc / CV" tiếng Anh là gì?',
      options: [{ id: 'a', text: 'Resume' }, { id: 'b', text: 'Contract' }, { id: 'c', text: 'Report' }, { id: 'd', text: 'Reference' }],
      correctOptionId: 'a',
      explanation: '"Resume" (Mỹ) hoặc "CV" (Anh) = hồ sơ xin việc. "Contract" = hợp đồng.',
    },
    {
      id: 'q004_5', quizId: 'q004', order: 5, type: 'multiple_choice',
      questionText: '"They ___ a better deal during the meeting." — Điền từ về đàm phán:',
      options: [{ id: 'a', text: 'collaborated' }, { id: 'b', text: 'negotiated' }, { id: 'c', text: 'terminated' }, { id: 'd', text: 'outsourced' }],
      correctOptionId: 'b',
      explanation: '"Negotiate" = đàm phán, thương lượng. "Negotiate a deal" = thương lượng một thỏa thuận.',
    },
    {
      id: 'q004_6', quizId: 'q004', order: 6, type: 'true_false',
      questionText: '"Salary" và "wage" đều có nghĩa là tiền lương, nhưng "salary" thường trả theo tháng còn "wage" theo giờ/ngày.',
      options: [{ id: 'true', text: '✅ Đúng' }, { id: 'false', text: '❌ Sai' }],
      correctOptionId: 'true',
      explanation: 'Đúng! "Salary" = lương tháng (nhân viên văn phòng). "Wage" = lương theo giờ/ngày (công nhân).',
    },
    {
      id: 'q004_7', quizId: 'q004', order: 7, type: 'multiple_choice',
      questionText: '"She submitted her ___ letter and left the company." — Điền từ:',
      options: [{ id: 'a', text: 'promotion' }, { id: 'b', text: 'resignation' }, { id: 'c', text: 'application' }, { id: 'd', text: 'qualification' }],
      correctOptionId: 'b',
      explanation: '"Resignation letter" = đơn xin nghỉ việc. "Submit a resignation" = nộp đơn từ chức.',
    },
    {
      id: 'q004_8', quizId: 'q004', order: 8, type: 'multiple_choice',
      questionText: '"The company ___ its IT support to a third party." — Điền từ:',
      options: [{ id: 'a', text: 'insourced' }, { id: 'b', text: 'promoted' }, { id: 'c', text: 'outsourced' }, { id: 'd', text: 'collaborated' }],
      correctOptionId: 'c',
      explanation: '"Outsource" = thuê bên ngoài thực hiện công việc thay vì tự làm.',
    },
    {
      id: 'q004_9', quizId: 'q004', order: 9, type: 'true_false',
      questionText: '"Entrepreneur" là từ dùng để chỉ một nhân viên cấp thấp trong công ty.',
      options: [{ id: 'true', text: '✅ Đúng' }, { id: 'false', text: '❌ Sai' }],
      correctOptionId: 'false',
      explanation: 'Sai! "Entrepreneur" = doanh nhân, người khởi nghiệp — người tự tạo ra doanh nghiệp.',
    },
    {
      id: 'q004_10', quizId: 'q004', order: 10, type: 'multiple_choice',
      questionText: '"He often works ___ on weekdays to meet the project deadline."',
      options: [{ id: 'a', text: 'undertime' }, { id: 'b', text: 'overtime' }, { id: 'c', text: 'parttime' }, { id: 'd', text: 'fulltime' }],
      correctOptionId: 'b',
      explanation: '"Overtime" = tăng ca, làm thêm giờ ngoài giờ làm bình thường.',
    },
    {
      id: 'q004_11', quizId: 'q004', order: 11, type: 'multiple_choice',
      questionText: 'Chọn từ phù hợp: "She has excellent ___ for this position — a Master\'s degree and 5 years experience."',
      options: [{ id: 'a', text: 'salaries' }, { id: 'b', text: 'colleagues' }, { id: 'c', text: 'qualifications' }, { id: 'd', text: 'resignations' }],
      correctOptionId: 'c',
      explanation: '"Qualifications" = bằng cấp và kinh nghiệm — những gì chứng minh năng lực cho một vị trí.',
    },
    {
      id: 'q004_12', quizId: 'q004', order: 12, type: 'true_false',
      questionText: '"Job interview" là buổi gặp gỡ giữa nhà tuyển dụng và ứng viên để đánh giá sự phù hợp.',
      options: [{ id: 'true', text: '✅ Đúng' }, { id: 'false', text: '❌ Sai' }],
      correctOptionId: 'true',
      explanation: 'Đúng! "Job interview" = phỏng vấn xin việc — buổi gặp để nhà tuyển dụng đánh giá ứng viên.',
    },
  ],

  q005: [
    {
      id: 'q005_1', quizId: 'q005', order: 1, type: 'multiple_choice',
      questionText: '"The researcher tested the ___." — Điền từ học thuật phù hợp:',
      options: [{ id: 'a', text: 'menu' }, { id: 'b', text: 'hypothesis' }, { id: 'c', text: 'deadline' }, { id: 'd', text: 'salary' }],
      correctOptionId: 'b',
      explanation: '"Hypothesis" = giả thuyết. Nhà nghiên cứu kiểm tra giả thuyết.',
    },
    {
      id: 'q005_2', quizId: 'q005', order: 2, type: 'multiple_choice',
      questionText: '"The ___ section explains the research approach." — Điền từ đúng:',
      options: [{ id: 'a', text: 'conclusion' }, { id: 'b', text: 'abstract' }, { id: 'c', text: 'methodology' }, { id: 'd', text: 'bibliography' }],
      correctOptionId: 'c',
      explanation: '"Methodology" = phương pháp luận — phần giải thích cách nghiên cứu được tiến hành.',
    },
    {
      id: 'q005_3', quizId: 'q005', order: 3, type: 'true_false',
      questionText: '"Analyze" và "analyse" là hai cách viết khác nhau của cùng một từ (Mỹ vs Anh).',
      options: [{ id: 'true', text: '✅ Đúng' }, { id: 'false', text: '❌ Sai' }],
      correctOptionId: 'true',
      explanation: 'Đúng! "Analyze" (Mỹ) = "Analyse" (Anh) — đều nghĩa là phân tích.',
    },
    {
      id: 'q005_4', quizId: 'q005', order: 4, type: 'multiple_choice',
      questionText: '"There was a ___ improvement in the results." — Điền tính từ học thuật:',
      options: [{ id: 'a', text: 'small' }, { id: 'b', text: 'significant' }, { id: 'c', text: 'short' }, { id: 'd', text: 'similar' }],
      correctOptionId: 'b',
      explanation: '"Significant" = đáng kể, quan trọng — từ học thuật thường gặp trong IELTS writing.',
    },
    {
      id: 'q005_5', quizId: 'q005', order: 5, type: 'multiple_choice',
      questionText: 'Chọn từ nối (linking word) phù hợp: "The study found positive results; ___, it should be replicated."',
      options: [{ id: 'a', text: 'however' }, { id: 'b', text: 'consequently' }, { id: 'c', text: 'nevertheless' }, { id: 'd', text: 'whereas' }],
      correctOptionId: 'b',
      explanation: '"Consequently" = do đó, vì vậy. Phù hợp với kết quả tốt dẫn đến kết luận cần tái thực hiện.',
    },
    {
      id: 'q005_6', quizId: 'q005', order: 6, type: 'true_false',
      questionText: '"Furthermore" dùng để bổ sung thêm thông tin, tương tự "in addition".',
      options: [{ id: 'true', text: '✅ Đúng' }, { id: 'false', text: '❌ Sai' }],
      correctOptionId: 'true',
      explanation: 'Đúng! "Furthermore" và "in addition" đều nghĩa là "hơn nữa, thêm vào đó" — dùng để thêm ý.',
    },
    {
      id: 'q005_7', quizId: 'q005', order: 7, type: 'multiple_choice',
      questionText: '"This research shifts the existing ___." — Điền từ chỉ mô hình tư duy:',
      options: [{ id: 'a', text: 'deadline' }, { id: 'b', text: 'paradigm' }, { id: 'c', text: 'salary' }, { id: 'd', text: 'menu' }],
      correctOptionId: 'b',
      explanation: '"Paradigm" = mô hình, phương thức tư duy. "Paradigm shift" = sự thay đổi mô hình tư duy.',
    },
    {
      id: 'q005_8', quizId: 'q005', order: 8, type: 'multiple_choice',
      questionText: '"We conducted a ___ review of the literature." — Điền tính từ:',
      options: [{ id: 'a', text: 'simple' }, { id: 'b', text: 'brief' }, { id: 'c', text: 'comprehensive' }, { id: 'd', text: 'random' }],
      correctOptionId: 'c',
      explanation: '"Comprehensive review" = đánh giá toàn diện — từ thường gặp trong phương pháp nghiên cứu.',
    },
    {
      id: 'q005_9', quizId: 'q005', order: 9, type: 'multiple_choice',
      questionText: '"They ___ new policies last year." — Điền động từ học thuật:',
      options: [{ id: 'a', text: 'thought' }, { id: 'b', text: 'implemented' }, { id: 'c', text: 'mentioned' }, { id: 'd', text: 'said' }],
      correctOptionId: 'b',
      explanation: '"Implement" = thực hiện, triển khai. Từ học thuật lịch sự hơn "do/make".',
    },
    {
      id: 'q005_10', quizId: 'q005', order: 10, type: 'true_false',
      questionText: '"Evaluate" có nghĩa là "xác định giá trị/chất lượng của cái gì đó qua phân tích kỹ lưỡng".',
      options: [{ id: 'true', text: '✅ Đúng' }, { id: 'false', text: '❌ Sai' }],
      correctOptionId: 'true',
      explanation: 'Đúng! "Evaluate" = đánh giá có hệ thống, thường gặp trong IELTS task 2 và nghiên cứu học thuật.',
    },
  ],
}
