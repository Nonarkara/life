// How each scene that names a parent is retold for a household without that parent. Read scene by scene
// on 16 Nov 2026: 'strings' are templates (tokens mark the parent and that parent's own pronouns),
// 'custom' is exact English for one household, 'customLang' is exact text for one household in one
// language (where swapping the kin word in the translation was not enough), 'gate' lists households
// the scene is not offered to. Households: GM mother+grandmother, GF father+grandmother, MM two mothers,
// FF two fathers. No native reader has checked the Thai, Chinese, Japanese or Korean. See kin.js.
export const KIN_SCENES={
 "commitment": {
  "strings": {
   "Stay together, each caring for your own parents": "Stay together, each caring for your own {parents}",
   "You and {partner} stayed committed while each of you looked after your own parents, in two homes.": "You and {partner} stayed committed while each of you looked after your own {parents}, in two homes."
  }
 },
 "l_defined": {
  "strings": {
   "Your parents choose a field for you": "Your {parents} choose a field for you",
   "Your parents want you in a respected field. You want something else entirely.": "Your {parents} want you in a respected field. You want something else entirely."
  }
 },
 "class_photo": {
  "strings": {
   "Your mother finds a photograph of the house your family lived in before the city. The place no longer exists, but the image is clear. Frame it, or put it away?": "Your {mother} finds a photograph of the house your family lived in before the city. The place no longer exists, but the image is clear. Frame it, or put it away?"
  }
 },
 "class_record": {
  "strings": {
   "The ledger your father kept": "The ledger your {father} kept",
   "You find your father’s old account book. Every expense, every debt, every small kindness recorded by hand. Study it, or let it stay closed?": "You find your {father}’s old account book. Every expense, every debt, every small kindness recorded by hand. Study it, or let it stay closed?"
  }
 },
 "th_midlife_frugality": {
  "gate": [
   "GF"
  ],
  "strings": {
   "You grew up warned never to wish beyond your station and to save every baht. At midlife, with half your years behind you and your mother tending the small routines of home, you have enough.": "You grew up warned never to wish beyond your station and to save every baht. At midlife, with half your years behind you and your {mother} tending the small routines of home, you have enough."
  }
 },
 "w1_inheritance": {
  "strings": {
   "Your father left the land in three pieces. Your sister has the house you grew up in. Your old room still has your height marked on the door frame.": "Your {father} left the land in three pieces. Your sister has the house you grew up in. Your old room still has your height marked on the door frame."
  }
 },
 "w1_match": {
  "strings": {
   "The two mothers have arranged a dinner. The other family's child keeps checking the door. Your mother has bought you a new shirt for it.": "The two mothers have arranged a dinner. The other family's child keeps checking the door. Your {mother} has bought you a new shirt for it.",
   "You were polite. Your mother stopped mentioning it after a week, which was worse.": "You were polite. Your {mother} stopped mentioning it after a week, which was worse."
  },
  "custom": {
   "The two mothers have arranged a dinner. The other family's child keeps checking the door. Your mother has bought you a new shirt for it.": {
    "GF": "Your grandmother and the other family's mother have arranged a dinner. The other family's child keeps checking the door. Your grandmother has bought you a new shirt for it.",
    "FF": "Your other father and the other family's mother have arranged a dinner. The other family's child keeps checking the door. Your other father has bought you a new shirt for it.",
    "MM": "Your mother and the other family's mother have arranged a dinner. The other family's child keeps checking the door. Your mother has bought you a new shirt for it."
   },
   "You talked about the food, then about your mothers. It was a better evening than either of you expected.": {
    "GF": "You talked about the food, then about your grandmother and their mother. It was a better evening than either of you expected.",
    "FF": "You talked about the food, then about your other father and their mother. It was a better evening than either of you expected.",
    "MM": "You talked about the food, then about your mother and theirs. It was a better evening than either of you expected."
   }
  },
  "customLang": {
   "The two mothers have arranged a dinner. The other family's child keeps checking the door. Your mother has bought you a new shirt for it.": {
    "GF": {
     "th": "ย่ากับแม่ของอีกบ้านนัดกินข้าวเย็นกันไว้ ลูกของอีกบ้านเอาแต่มองไปทางประตู ย่าซื้อเสื้อตัวใหม่ให้คุณใส่ไปมื้อนี้",
     "zh-CN": "你奶奶和对方家的母亲安排了一顿晚饭。对方家的孩子一直往门口看。你奶奶为这顿饭给你买了件新衬衫。",
     "ja": "祖母と相手の家の母親が夕食の席を設けた。相手の家の子は、何度も戸口のほうを見ている。祖母はこの日のために新しいシャツを買ってくれた。",
     "ko": "할머니와 상대 집 어머니가 저녁 자리를 마련했다. 상대 집 아이는 자꾸 문 쪽을 본다. 할머니는 이날을 위해 새 셔츠를 사 주었다."
    },
    "FF": {
     "th": "พ่ออีกคนกับแม่ของอีกบ้านนัดกินข้าวเย็นกันไว้ ลูกของอีกบ้านเอาแต่มองไปทางประตู พ่ออีกคนซื้อเสื้อตัวใหม่ให้คุณใส่ไปมื้อนี้",
     "zh-CN": "你另一位父亲和对方家的母亲安排了一顿晚饭。对方家的孩子一直往门口看。你另一位父亲为这顿饭给你买了件新衬衫。",
     "ja": "もう一人の父と相手の家の母親が夕食の席を設けた。相手の家の子は、何度も戸口のほうを見ている。もう一人の父はこの日のために新しいシャツを買ってくれた。",
     "ko": "다른 아버지와 상대 집 어머니가 저녁 자리를 마련했다. 상대 집 아이는 자꾸 문 쪽을 본다. 다른 아버지는 이날을 위해 새 셔츠를 사 주었다."
    },
    "MM": {
     "th": "แม่กับแม่ของอีกบ้านนัดกินข้าวเย็นกันไว้ ลูกของอีกบ้านเอาแต่มองไปทางประตู แม่ซื้อเสื้อตัวใหม่ให้คุณใส่ไปมื้อนี้",
     "zh-CN": "你母亲和对方家的母亲安排了一顿晚饭。对方家的孩子一直往门口看。你母亲为这顿饭给你买了件新衬衫。",
     "ja": "母と相手の家の母親が夕食の席を設けた。相手の家の子は、何度も戸口のほうを見ている。母はこの日のために新しいシャツを買ってくれた。",
     "ko": "어머니와 상대 집 어머니가 저녁 자리를 마련했다. 상대 집 아이는 자꾸 문 쪽을 본다. 어머니는 이날을 위해 새 셔츠를 사 주었다."
    }
   },
   "You talked about the food, then about your mothers. It was a better evening than either of you expected.": {
    "GF": {
     "th": "คุณคุยกันเรื่องอาหาร แล้วก็เรื่องย่าของคุณกับแม่ของเขา เป็นค่ำคืนที่ดีกว่าที่ทั้งสองคนคาดไว้",
     "zh-CN": "你们聊了菜，又聊了你奶奶和对方的母亲。那个晚上比你们俩预想的都好。",
     "ja": "料理の話をして、それから自分の祖母と相手の母親の話をした。どちらが思っていたよりも、いい晩になった。",
     "ko": "음식 이야기를 하다가, 당신의 할머니와 상대의 어머니 이야기를 했다. 둘 다 생각했던 것보다 괜찮은 저녁이었다."
    },
    "FF": {
     "th": "คุณคุยกันเรื่องอาหาร แล้วก็เรื่องพ่ออีกคนของคุณกับแม่ของเขา เป็นค่ำคืนที่ดีกว่าที่ทั้งสองคนคาดไว้",
     "zh-CN": "你们聊了菜，又聊了你另一位父亲和对方的母亲。那个晚上比你们俩预想的都好。",
     "ja": "料理の話をして、それから自分のもう一人の父と相手の母親の話をした。どちらが思っていたよりも、いい晩になった。",
     "ko": "음식 이야기를 하다가, 당신의 다른 아버지와 상대의 어머니 이야기를 했다. 둘 다 생각했던 것보다 괜찮은 저녁이었다."
    },
    "MM": {
     "th": "คุณคุยกันเรื่องอาหาร แล้วก็เรื่องแม่ของแต่ละคน เป็นค่ำคืนที่ดีกว่าที่ทั้งสองคนคาดไว้",
     "zh-CN": "你们聊了菜，又聊了各自的母亲。那个晚上比你们俩预想的都好。",
     "ja": "料理の話をして、それから互いの母親の話をした。どちらが思っていたよりも、いい晩になった。",
     "ko": "음식 이야기를 하다가, 각자의 어머니 이야기를 했다. 둘 다 생각했던 것보다 괜찮은 저녁이었다."
    }
   }
  }
 },
 "w1_transfer": {
  "strings": {
   "A transfer order sends you to a province six hundred kilometres away. Your father served out there once, and came home a different man.": "A transfer order sends you to a province six hundred kilometres away. Your {father} served out there once, and came home a different man."
  },
  "custom": {
   "A transfer order sends you to a province six hundred kilometres away. Your father served out there once, and came home a different man.": {
    "GM": "A transfer order sends you to a province six hundred kilometres away. Your grandmother served out there once, and came home a different woman.",
    "MM": "A transfer order sends you to a province six hundred kilometres away. Your other mother served out there once, and came home a different woman."
   }
  },
  "customLang": {
   "A transfer order sends you to a province six hundred kilometres away. Your father served out there once, and came home a different man.": {
    "GM": {
     "th": "คำสั่งย้ายส่งคุณไปจังหวัดที่ไกลออกไปหกร้อยกิโลเมตร ยายของคุณเคยไปรับราชการที่นั่น แล้วกลับมาเป็นคนละคน",
     "zh-CN": "一纸调令把你派到六百公里外的一个府。你外婆当年也在那边任过职，回来时变了一个人。",
     "ja": "異動の辞令で、六百キロ離れた県へ行くことになった。祖母もかつてそこで勤め、別人になって帰ってきた。",
     "ko": "전근 명령으로 600킬로미터 떨어진 지방에 가게 되었다. 할머니도 한때 그곳에서 근무했고, 딴사람이 되어 돌아왔다."
    },
    "MM": {
     "th": "คำสั่งย้ายส่งคุณไปจังหวัดที่ไกลออกไปหกร้อยกิโลเมตร แม่อีกคนของคุณเคยไปรับราชการที่นั่น แล้วกลับมาเป็นคนละคน",
     "zh-CN": "一纸调令把你派到六百公里外的一个府。你另一位母亲当年也在那边任过职，回来时变了一个人。",
     "ja": "異動の辞令で、六百キロ離れた県へ行くことになった。もう一人の母もかつてそこで勤め、別人になって帰ってきた。",
     "ko": "전근 명령으로 600킬로미터 떨어진 지방에 가게 되었다. 다른 어머니도 한때 그곳에서 근무했고, 딴사람이 되어 돌아왔다."
    }
   }
  }
 },
 "w1_driver": {
  "strings": {
   "Your family's driver of forty years is in hospital. He drove you to school every morning and never once told your parents where you really went after school.": "Your family's driver of forty years is in hospital. He drove you to school every morning and never once told your {parents} where you really went after school.",
   "You sat with him on Sundays. He told you stories about your father you had never heard.": "You sat with him on Sundays. He told you stories about your {father} you had never heard."
  }
 },
 "w1_grandma_raised": {
  "gate": [
   "GF"
  ],
  "strings": {
   "You work in Bangkok. Your child lives in the village with your mother. On the phone your child calls their grandmother \"Mother\", and calls you by your nickname.": "You work in Bangkok. Your child lives in the village with your {mother}. On the phone your child calls their grandmother \"Mother\", and calls you by your nickname."
  },
  "custom": {
   "On the phone, she calls her grandmother \"Mother\"": {
    "FF": "On the phone, she calls her grandfather \"Father\""
   },
   "You work in Bangkok. Your child lives in the village with your mother. On the phone your child calls their grandmother \"Mother\", and calls you by your nickname.": {
    "FF": "You work in Bangkok. Your child lives in the village with your other father. On the phone your child calls their grandfather \"Father\", and calls you by your nickname."
   },
   "Your child came, missed the chickens and their grandmother, and said so every night.": {
    "FF": "Your child came, missed the chickens and their grandfather, and said so every night."
   }
  },
  "customLang": {
   "On the phone, she calls her grandmother \"Mother\"": {
    "FF": {
     "th": "ทางโทรศัพท์ ลูกเรียกพ่ออีกคนของคุณว่า \"พ่อ\"",
     "zh-CN": "电话里，孩子管你另一位父亲叫\"爸爸\"",
     "ja": "電話で、子どもはあなたのもう一人の父を「お父さん」と呼ぶ",
     "ko": "전화로, 아이는 당신의 다른 아버지를 \"아빠\"라고 부른다"
    }
   },
   "You work in Bangkok. Your child lives in the village with your mother. On the phone your child calls their grandmother \"Mother\", and calls you by your nickname.": {
    "FF": {
     "th": "คุณทำงานอยู่กรุงเทพฯ ลูกอยู่ที่หมู่บ้านกับพ่ออีกคนของคุณ ทางโทรศัพท์ ลูกเรียกพ่ออีกคนของคุณว่า \"พ่อ\" และเรียกคุณด้วยชื่อเล่น",
     "zh-CN": "你在曼谷工作。孩子跟你另一位父亲住在村里。电话里，孩子管你另一位父亲叫\"爸爸\"，管你叫小名。",
     "ja": "あなたはバンコクで働いている。子どもは村であなたのもう一人の父と暮らしている。電話で、子どもはあなたのもう一人の父を「お父さん」と呼び、あなたのことは愛称で呼ぶ。",
     "ko": "당신은 방콕에서 일한다. 아이는 시골에서 당신의 다른 아버지와 산다. 전화로 아이는 당신의 다른 아버지를 \"아빠\"라고 부르고, 당신은 별명으로 부른다."
    }
   },
   "Your child came, missed the chickens and their grandmother, and said so every night.": {
    "FF": {
     "th": "ลูกมาอยู่ด้วย ลูกคิดถึงไก่ คิดถึงพ่ออีกคนของคุณ แล้วก็บอกอย่างนั้นทุกคืน",
     "zh-CN": "孩子来了，想那些鸡，想你另一位父亲，每天晚上都这么说。",
     "ja": "子どもは来た。鶏とあなたのもう一人の父を恋しがり、毎晩そう言った。",
     "ko": "아이는 왔고, 닭들과 당신의 다른 아버지를 그리워했고, 밤마다 그렇게 말했다."
    }
   }
  }
 },
 "w1_boat_engine": {
  "strings": {
   "The engine on the family boat has died. Fixing it will cost a month of catches. Your father is sitting on the jetty looking at it.": "The engine on the family boat has died. Fixing it will cost a month of catches. Your {father} is sitting on the jetty looking at it.",
   "Sell your mother's gold chain": "Sell your {mother}'s gold chain",
   "She took the chain off without a word. The engine started on the second pull.": "{She} took the chain off without a word. The engine started on the second pull."
  }
 },
 "w1_gold": {
  "strings": {
   "Your mother keeps a one-baht gold necklace for emergencies. The school fees are due. The pawnshop is at the end of the soi.": "Your {mother} keeps a one-baht gold necklace for emergencies. The school fees are due. The pawnshop is at the end of the soi."
  }
 },
 "w1_tickets": {
  "strings": {
   "Two tickets in his shirt pocket": "Two tickets in {his} shirt pocket",
   "In your father's shirt pocket you find two lottery tickets with the same number. The number is your birthday.": "In your {father}'s shirt pocket you find two lottery tickets with the same number. The number is your birthday.",
   "You put the tickets in the drawer with his watch.": "You put the tickets in the drawer with {his} watch.",
   "Give them to your mother": "Give them to your {mother}",
   "Your mother looked at the number for a long time, then laughed for the first time that week.": "Your {mother} looked at the number for a long time, then laughed for the first time that week."
  },
  "customLang": {
   "Your mother looked at the number for a long time, then laughed for the first time that week.": {
    "FF": {
     "zh-CN": "另一位父亲盯着那个号码看了很久，然后笑了，那是他那个星期第一次笑。"
    }
   }
  }
 },
 "w1_scale": {
  "strings": {
   "You notice your mother's market scale reads fifty grams heavy. The regular customers do not know. Your school fees come out of that stall.": "You notice your {mother}'s market scale reads fifty grams heavy. The regular customers do not know. Your school fees come out of that stall.",
   "Tell her you noticed": "Tell {her} you noticed",
   "She looked at you for a long moment. The next morning the scale was right.": "{She} looked at you for a long moment. The next morning the scale was right.",
   "You fixed it before she woke. She never mentioned it, and neither did you.": "You fixed it before {she} woke. {She} never mentioned it, and neither did you."
  }
 },
 "w1_ordain": {
  "strings": {
   "Your mother wants you ordained": "Your {mother} wants you ordained",
   "Your mother wants you to be ordained as a monk before you settle down. Your boss says your job will not wait three months.": "Your {mother} wants you to be ordained as a monk before you settle down. Your boss says your job will not wait three months.",
   "You promised later. Your mother kept the saffron cloth she had bought, folded in a drawer.": "You promised later. Your {mother} kept the saffron cloth {she} had bought, folded in a drawer.",
   "You lost the job. On the morning your head was shaved, your mother cried in the front row.": "You lost the job. On the morning your head was shaved, your {mother} cried in the front row."
  }
 },
 "w1_daughter": {
  "strings": {
   "You paid for a carer. Your mother asked for you by name every evening.": "You paid for a carer. Your {mother} asked for you by name every evening."
  },
  "custom": {
   "Your parents are getting old. Your brothers have families of their own. Everyone assumes, without anyone saying it, that you will be the one to move home.": {
    "GM": "Your mother and grandmother are getting old. Your brothers have families of their own. Everyone assumes, without anyone saying it, that you will be the one to move home.",
    "GF": "Your father and grandmother are getting old. Your brothers have families of their own. Everyone assumes, without anyone saying it, that you will be the one to move home."
   }
  },
  "customLang": {
   "Your parents are getting old. Your brothers have families of their own. Everyone assumes, without anyone saying it, that you will be the one to move home.": {
    "GM": {
     "th": "แม่กับยายแก่ลงทุกวัน พี่ชายน้องชายต่างมีครอบครัวของตัวเอง ทุกคนต่างคิดเอาเองโดยไม่มีใครพูดออกมาว่า คุณจะเป็นคนย้ายกลับบ้าน",
     "zh-CN": "母亲和外婆渐渐老了。兄弟们都有了自己的家。人人都默认，虽然没人说出口，搬回家的会是你。",
     "ja": "母と祖母は年をとってきた。兄弟にはそれぞれの家庭がある。誰も口にしないまま、実家に戻るのはあなただと皆が思っている。",
     "ko": "어머니와 할머니는 늙어 간다. 남자 형제들은 각자 가정이 있다. 아무도 입 밖에 내지 않았지만, 다들 본가로 들어갈 사람은 당신이라고 여긴다."
    },
    "GF": {
     "th": "พ่อกับย่าแก่ลงทุกวัน พี่ชายน้องชายต่างมีครอบครัวของตัวเอง ทุกคนต่างคิดเอาเองโดยไม่มีใครพูดออกมาว่า คุณจะเป็นคนย้ายกลับบ้าน",
     "zh-CN": "父亲和奶奶渐渐老了。兄弟们都有了自己的家。人人都默认，虽然没人说出口，搬回家的会是你。",
     "ja": "父と祖母は年をとってきた。兄弟にはそれぞれの家庭がある。誰も口にしないまま、実家に戻るのはあなただと皆が思っている。",
     "ko": "아버지와 할머니는 늙어 간다. 남자 형제들은 각자 가정이 있다. 아무도 입 밖에 내지 않았지만, 다들 본가로 들어갈 사람은 당신이라고 여긴다."
    }
   }
  }
 },
 "w1_rice": {
  "strings": {
   "Every month your father sends a fifteen-kilo sack of rice from the village on the bus. You can buy rice at the corner shop for less than the fare.": "Every month your {father} sends a fifteen-kilo sack of rice from the village on the bus. You can buy rice at the corner shop for less than the fare.",
   "Tell him he does not need to": "Tell {him} {he} does not need to",
   "He stopped. On the phone he sounded older.": "{He} stopped. On the phone {he} sounded older.",
   "You kept collecting it. Your neighbours ate well, and your father asked if the rice was good this year.": "You kept collecting it. Your neighbours ate well, and your {father} asked if the rice was good this year."
  }
 },
 "w1_ward_chair": {
  "strings": {
   "Your mother is in a public ward. Someone in the family has to sleep beside her on a plastic chair each night.": "Your {mother} is in a public ward. Someone in the family has to sleep beside {her} on a plastic chair each night.",
   "The carer was kind. Your mother called her by your name.": "The carer was kind. Your {mother} called her by your name."
  }
 },
 "w1_songkran": {
  "strings": {
   "You worked through. Your mother sent a photo of the family with an empty space at the end.": "You worked through. Your {mother} sent a photo of the family with an empty space at the end.",
   "You poured water over your parents' hands. Your mother said you looked tired.": "You poured water over your parents' hands. Your {mother} said you looked tired.",
   "You sent money for the offering. Your mother said the monks chanted your name.": "You sent money for the offering. Your {mother} said the monks chanted your name."
  },
  "custom": {
   "You poured water over your parents' hands. Your mother said you looked tired.": {
    "GM": "You poured water over your mother's and grandmother's hands. Your mother said you looked tired.",
    "GF": "You poured water over your father's and grandmother's hands. Your grandmother said you looked tired."
   }
  },
  "customLang": {
   "You poured water over your parents' hands. Your mother said you looked tired.": {
    "GM": {
     "th": "คุณรดน้ำดำหัวแม่กับยาย แม่บอกว่าคุณดูเหนื่อยๆ",
     "zh-CN": "你把水浇在母亲和外婆的手上。母亲说你看起来很累。",
     "ja": "母と祖母の手に水をかけた。母は、疲れた顔をしているねと言った。",
     "ko": "어머니와 할머니 손에 물을 부어 드렸다. 어머니는 당신이 피곤해 보인다고 했다."
    },
    "GF": {
     "th": "คุณรดน้ำดำหัวพ่อกับย่า ย่าบอกว่าคุณดูเหนื่อยๆ",
     "zh-CN": "你把水浇在父亲和奶奶的手上。奶奶说你看起来很累。",
     "ja": "父と祖母の手に水をかけた。祖母は、疲れた顔をしているねと言った。",
     "ko": "아버지와 할머니 손에 물을 부어 드렸다. 할머니는 당신이 피곤해 보인다고 했다."
    },
    "FF": {
     "th": "คุณรดน้ำดำหัวพ่อทั้งสองคน พ่ออีกคนบอกว่าคุณดูเหนื่อยๆ",
     "zh-CN": "你把水浇在双亲的手上。另一位父亲说你看起来很累。"
    }
   }
  }
 },
 "w1_first_pay": {
  "strings": {
   "Your first salary is in an envelope. In your family, the first salary goes to your mother.": "Your first salary is in an envelope. In your family, the first salary goes to your {mother}.",
   "You bought what you needed. Your mother told the neighbours you had a good job.": "You bought what you needed. Your {mother} told the neighbours you had a good job.",
   "Give her all of it": "Give {her} all of it",
   "She took it with both hands. Months later you found she had put it in a bank book in your name.": "{She} took it with both hands. Months later you found {she} had put it in a bank book in your name.",
   "Give her half": "Give {her} half",
   "She smiled and counted it twice.": "{She} smiled and counted it twice."
  }
 },
 "w2_uniform": {
  "strings": {
   "You unpicked it with your mother's needle. The holes stayed in the cloth all year.": "You unpicked it with your {mother}'s needle. The holes stayed in the cloth all year.",
   "Your mother bought one. She wore her own sandals another year.": "Your {mother} bought one. {She} wore {her's} own sandals another year."
  }
 },
 "w2_one_place": {
  "strings": {
   "Ask your father to decide on marks": "Ask your {father} to decide on marks",
   "He looked at both report cards for a long time. It was the first argument you ever won.": "{He} looked at both report cards for a long time. It was the first argument you ever won."
  }
 },
 "w2_tutor": {
  "strings": {
   "Everyone in your class goes to the tutoring school after school and on Saturdays. Your parents have the money. You have not had a free afternoon in a year.": "Everyone in your class goes to the tutoring school after school and on Saturdays. Your {parents} have the money. You have not had a free afternoon in a year.",
   "Your parents gave you one term. You kept to it, mostly.": "Your {parents} gave you one term. You kept to it, mostly."
  }
 },
 "w2_cows": {
  "strings": {
   "Ask your father to sell one": "Ask your {father} to sell one",
   "He did not sell one. He did start walking them himself on Mondays.": "{He} did not sell one. {He} did start walking them {himself} on Mondays."
  }
 },
 "w2_ponies": {
  "strings": {
   "In the school holidays, the man who hires out ponies on the beach pays a few coins to anyone who will lead them home at dusk. Your mother says the sand is not a job.": "In the school holidays, the man who hires out ponies on the beach pays a few coins to anyone who will lead them home at dusk. Your {mother} says the sand is not a job.",
   "You led two ponies home every evening. Your mother stopped mentioning the sand.": "You led two ponies home every evening. Your {mother} stopped mentioning the sand.",
   "Stay home as she asks": "Stay home as {she} asks"
  }
 },
 "w2_siam_tutor": {
  "strings": {
   "The tutoring schools above the shops in Siam Square are full every Saturday. Your father says the fee is a month of his overtime.": "The tutoring schools above the shops in Siam Square are full every Saturday. Your {father} says the fee is a month of {his} overtime.",
   "Your father worked the overtime. You sat at the back and copied every board.": "Your {father} worked the overtime. You sat at the back and copied every board.",
   "You studied at the kitchen table. Your father kept his overtime and bought a fan.": "You studied at the kitchen table. Your {father} kept {his} overtime and bought a fan."
  }
 },
 "w2_stall_shift": {
  "strings": {
   "You came back twenty minutes late. Your father said nothing, which was worse.": "You came back twenty minutes late. Your {father} said nothing, which was worse.",
   "Your friends ate half the stock. Your mother charged their mothers.": "Your friends ate half the stock. Your {mother} charged their mothers."
  },
  "custom": {
   "At five every evening you mind your parents' stall so they can eat. Your friends are at the football ground across the road.": {
    "GM": "At five every evening you mind your family's stall so they can eat. Your friends are at the football ground across the road.",
    "GF": "At five every evening you mind your family's stall so they can eat. Your friends are at the football ground across the road."
   }
  },
  "customLang": {
   "At five every evening you mind your parents' stall so they can eat. Your friends are at the football ground across the road.": {
    "GM": {
     "th": "ห้าโมงเย็นทุกวัน คุณเฝ้าแผงให้ครอบครัวได้กินข้าว เพื่อนๆ อยู่ที่สนามฟุตบอลฝั่งตรงข้าม",
     "zh-CN": "每天傍晚五点，你替家里人看摊，好让他们吃饭。 你的朋友们都在马路对面的球场上。",
     "ja": "毎夕五時、家族が食事をとれるよう、あなたが店番をする。 友だちは道の向こうのサッカー場にいる。",
     "ko": "매일 저녁 다섯 시, 가족이 식사할 수 있도록 당신이 노점을 본다. 친구들은 길 건너 축구장에 있다."
    },
    "GF": {
     "th": "ห้าโมงเย็นทุกวัน คุณเฝ้าแผงให้ครอบครัวได้กินข้าว เพื่อนๆ อยู่ที่สนามฟุตบอลฝั่งตรงข้าม",
     "zh-CN": "每天傍晚五点，你替家里人看摊，好让他们吃饭。 你的朋友们都在马路对面的球场上。",
     "ja": "毎夕五時、家族が食事をとれるよう、あなたが店番をする。 友だちは道の向こうのサッカー場にいる。",
     "ko": "매일 저녁 다섯 시, 가족이 식사할 수 있도록 당신이 노점을 본다. 친구들은 길 건너 축구장에 있다."
    }
   },
   "Your friends ate half the stock. Your mother charged their mothers.": {
    "GF": {
     "th": "เพื่อนๆ กินของไปครึ่งแผง ย่าไปเก็บเงินจากแม่ของพวกเขา",
     "zh-CN": "朋友们吃掉了一半的货。 你奶奶找他们的母亲收了钱。",
     "ja": "友だちは品物の半分を食べた。 祖母はその分を彼らの母親に請求した。",
     "ko": "친구들이 물건의 절반을 먹어 치웠다. 할머니는 그 값을 친구들 어머니에게 받았다."
    },
    "FF": {
     "th": "เพื่อนๆ กินของไปครึ่งแผง พ่ออีกคนไปเก็บเงินจากแม่ของพวกเขา",
     "zh-CN": "朋友们吃掉了一半的货。 你另一位父亲找他们的母亲收了钱。",
     "ja": "友だちは品物の半分を食べた。 もう一人の父はその分を彼らの母親に請求した。",
     "ko": "친구들이 물건의 절반을 먹어 치웠다. 다른 아버지는 그 값을 친구들 어머니에게 받았다."
    }
   }
  }
 },
 "w2_entrance": {
  "strings": {
   "The university form asks for your first choice. Your parents want medicine or law. You want something they would have to look up.": "The university form asks for your first choice. Your {parents} want medicine or law. You want something they would have to look up.",
   "You wrote their choice. On the morning of the results your mother bought sweets for the whole soi.": "You wrote their choice. On the morning of the results your {mother} bought sweets for the whole soi.",
   "You wrote your own. Your father read the form twice and signed it.": "You wrote your own. Your {father} read the form twice and signed it."
  },
  "customLang": {
   "You wrote their choice. On the morning of the results your mother bought sweets for the whole soi.": {
    "GF": {
     "th": "คุณเขียนตามที่ครอบครัวเลือก เช้าวันประกาศผล ย่าซื้อขนมแจกทั้งซอย",
     "ko": "가족의 선택을 썼다. 결과가 나온 날 아침, 할머니는 골목 전체에 과자를 돌렸다."
    },
    "FF": {
     "th": "คุณเขียนตามที่พ่อทั้งสองคนเลือก เช้าวันประกาศผล พ่ออีกคนซื้อขนมแจกทั้งซอย"
    }
   }
  }
 },
 "w2_civil_exam": {
  "strings": {
   "Your father wants you in the civil service": "Your {father} wants you in the civil service",
   "Your father wants you to sit the civil service exam. The salary is small, he says, but the pension is for life and the hospital is free.": "Your {father} wants you to sit the civil service exam. The salary is small, {he} says, but the pension is for life and the hospital is free.",
   "You passed in the third year. Your father framed the letter.": "You passed in the third year. Your {father} framed the letter.",
   "You stayed. Your father asked about the exam every New Year, then stopped.": "You stayed. Your {father} asked about the exam every New Year, then stopped."
  }
 },
 "north_silver": {
  "strings": {
   "Your father hammers patterns into silver bowls for the shops by the old city gate. He wants you at his bench after school. Your teacher wants you in the library.": "Your {father} hammers patterns into silver bowls for the shops by the old city gate. {He} wants you at {his} bench after school. Your teacher wants you in the library.",
   "Sit at his bench": "Sit at {his} bench",
   "You read until the library closed. Your father worked the bench alone.": "You read until the library closed. Your {father} worked the bench alone.",
   "You did both for a year. Your mother made you rice soup at midnight.": "You did both for a year. Your {mother} made you rice soup at midnight."
  }
 },
 "isan_loom": {
  "strings": {
   "The silk on your mother's loom": "The silk on your {mother}'s loom",
   "Your mother weaves silk under the house in the dry season. The pattern is tied into the thread before it is dyed. She asks if you want to learn it.": "Your {mother} weaves silk under the house in the dry season. The pattern is tied into the thread before it is dyed. {She} asks if you want to learn it.",
   "Your fingers learned the knots before your head did. Your mother checked every one.": "Your fingers learned the knots before your head did. Your {mother} checked every one.",
   "You spent the dry season at the pond. Your mother kept weaving.": "You spent the dry season at the pond. Your {mother} kept weaving.",
   "Carry her cloth to the market": "Carry {her's} cloth to the market"
  }
 },
 "isan_bus": {
  "strings": {
   "After the harvest your cousin is taking the bus to Bangkok to work until planting. There is a job for one more at the same place. Your father's back is bad this year.": "After the harvest your cousin is taking the bus to Bangkok to work until planting. There is a job for one more at the same place. Your {father}'s back is bad this year.",
   "Stay and help your father": "Stay and help your {father}",
   "Your cousin went alone. Your father mended the roof with one hand on his back.": "Your cousin went alone. Your {father} mended the roof with one hand on {his} back."
  }
 },
 "east_shift": {
  "strings": {
   "The plant runs three shifts and the supervisor asks if you want nights. Night pays more. Your mother's stall opens at six, and she counts on you to carry the crates.": "The plant runs three shifts and the supervisor asks if you want nights. Night pays more. Your {mother}'s stall opens at six, and {she} counts on you to carry the crates.",
   "You punched your card at ten every night. Your mother carried the crates alone, and the extra money went into a savings book.": "You punched your card at ten every night. Your {mother} carried the crates alone, and the extra money went into a savings book."
  }
 },
 "east_durian": {
  "strings": {
   "In durian season your father works the orchard from before dawn. He knocks each fruit with a short stick and listens. He needs someone to sort the fruit as he calls it.": "In durian season your {father} works the orchard from before dawn. {He} knocks each fruit with a short stick and listens. {He} needs someone to sort the fruit as {he} calls it.",
   "Sort the fruit with him": "Sort the fruit with {him}",
   "You learned to hear a ripe one under the stick. Your father let you weigh and price one load.": "You learned to hear a ripe one under the stick. Your {father} let you weigh and price one load.",
   "You came home sunburnt. Your father had sorted the fruit by lamp light.": "You came home sunburnt. Your {father} had sorted the fruit by lamp light."
  }
 },
 "west_palm": {
  "strings": {
   "Your father climbs the sugar palms before sunrise to bring down the sap. It has to be boiled the same morning or it turns sour. Someone has to keep the fire.": "Your {father} climbs the sugar palms before sunrise to bring down the sap. It has to be boiled the same morning or it turns sour. Someone has to keep the fire.",
   "Your father let you climb the short tree first. You scraped both knees on the bamboo ladder.": "Your {father} let you climb the short tree first. You scraped both knees on the bamboo ladder."
  },
  "custom": {
   "Your father climbs the sugar palms before sunrise to bring down the sap. It has to be boiled the same morning or it turns sour. Someone has to keep the fire.": {
    "GM": "Your mother climbs the sugar palms before sunrise to bring down the sap. It has to be boiled the same morning or it turns sour. Someone has to keep the fire."
   },
   "Your father let you climb the short tree first. You scraped both knees on the bamboo ladder.": {
    "GM": "Your mother let you climb the short tree first. You scraped both knees on the bamboo ladder."
   }
  },
  "customLang": {
   "Your father climbs the sugar palms before sunrise to bring down the sap. It has to be boiled the same morning or it turns sour. Someone has to keep the fire.": {
    "GM": {
     "th": "แม่ขึ้นต้นตาลก่อนตะวันขึ้นเพื่อเอาน้ำตาลสดลงมา ต้องเคี่ยวภายในเช้านั้น ไม่อย่างนั้นจะบูด ต้องมีคนคอยดูไฟ",
     "zh-CN": "日出之前，妈妈爬上糖棕树把汁液取下来。 当天早上就得熬，不然就酸了。 总得有人看着火。",
     "ja": "母は日の出前にオウギヤシに登り、樹液を下ろしてくる。 その朝のうちに煮詰めないと酸っぱくなる。 誰かが火の番をしなければならない。",
     "ko": "어머니는 해 뜨기 전에 팔미라야자에 올라 수액을 받아 내려온다. 그날 아침에 졸이지 않으면 시어진다. 누군가 불을 지켜야 한다."
    }
   },
   "Your father let you climb the short tree first. You scraped both knees on the bamboo ladder.": {
    "GM": {
     "th": "แม่ให้คุณลองขึ้นต้นเตี้ยก่อน คุณถลอกเข่าทั้งสองข้างกับพะองไม้ไผ่",
     "zh-CN": "妈妈先让你爬那棵矮的。 你在竹梯上把两个膝盖都蹭破了。",
     "ja": "母はまず背の低い木から登らせてくれた。 竹のはしごで両膝をすりむいた。",
     "ko": "어머니는 먼저 키 작은 나무부터 오르게 했다. 대나무 사다리에 두 무릎이 다 까졌다."
    }
   }
  }
 },
 "south_rubber": {
  "strings": {
   "Your mother taps the rubber trees in the dark before dawn, when the latex runs best. She cuts each tree and the latex drips into a cup below the cut. She asks you to come and collect the latex before school.": "Your {mother} taps the rubber trees in the dark before dawn, when the latex runs best. {She} cuts each tree and the latex drips into a cup below the cut. {She} asks you to come and collect the latex before school.",
   "Collect the latex with her": "Collect the latex with {her}",
   "You slept until it was light. Your mother carried every bucket herself.": "You slept until it was light. Your {mother} carried every bucket {herself}.",
   "You cut too deep the first week and she showed you again. By the end of the year your line was straight.": "You cut too deep the first week and {she} showed you again. By the end of the year your line was straight."
  }
 },
 "central_noodles": {
  "strings": {
   "Your family sells boat noodles at the landing, in small bowls, many to a customer. On weekends the queue reaches the road. Your mother asks you to wash bowls instead of going to tutoring.": "Your family sells boat noodles at the landing, in small bowls, many to a customer. On weekends the queue reaches the road. Your {mother} asks you to wash bowls instead of going to tutoring.",
   "You went to tutoring. Your mother hired a neighbour's girl for the weekends.": "You went to tutoring. Your {mother} hired a neighbour's girl for the weekends."
  }
 },
 "central_salt": {
  "strings": {
   "Rake with your father": "Rake with your {father}",
   "You went to school. Your father and uncle raked half the pans before the rain.": "You went to school. Your {father} and uncle raked half the pans before the rain.",
   "Six neighbours came. Your mother cooked for all of them and nobody went home before it was in.": "Six neighbours came. Your {mother} cooked for all of them and nobody went home before it was in."
  },
  "customLang": {
   "You went to school. Your father and uncle raked half the pans before the rain.": {
    "GM": {
     "ko": "학교에 갔다. 비가 오기 전에 할머니와 큰아버지는 염전 절반만 거둘 수 있었다."
    },
    "MM": {
     "ko": "학교에 갔다. 비가 오기 전에 다른 어머니와 큰아버지는 염전 절반만 거둘 수 있었다."
    }
   }
  }
 },
 "north_ward": {
  "strings": {
   "You keep the register on a ward at the provincial hospital. A clerk's post has opened in Bangkok at higher pay. Your mother lives two streets from the hospital.": "You keep the register on a ward at the provincial hospital. A clerk's post has opened in Bangkok at higher pay. Your {mother} lives two streets from the hospital.",
   "You stayed. Your mother brought you lunch in a tiffin tin on Fridays.": "You stayed. Your {mother} brought you lunch in a tiffin tin on Fridays.",
   "You went. Your mother learned to use the phone you sent her.": "You went. Your {mother} learned to use the phone you sent {her}."
  }
 },
 "isan_elephant": {
  "strings": {
   "Your family keeps an elephant, as Kuy families in the north of Surin have for generations. Your father walks her to the forest edge to feed at dawn. He asks you to learn her commands.": "Your family keeps an elephant, as Kuy families in the north of Surin have for generations. Your {father} walks her to the forest edge to feed at dawn. {He} asks you to learn her commands.",
   "She listened to your father first and to you second. One morning she listened only to you.": "She listened to your {father} first and to you second. One morning she listened only to you.",
   "You went to school. Your father walked her to the forest alone.": "You went to school. Your {father} walked her to the forest alone."
  }
 },
 "isan_khene": {
  "strings": {
   "Your father makes khene, the bamboo mouth organs, by hand. Each reed has to be tuned by ear against the one beside it. A band from town wants six by the end of the rains.": "Your {father} makes khene, the bamboo mouth organs, by hand. Each reed has to be tuned by ear against the one beside it. A band from town wants six by the end of the rains.",
   "Tune the reeds with him": "Tune the reeds with {him}",
   "You learned to hear when two reeds were close but not yet the same. Your father finished the sixth at dawn.": "You learned to hear when two reeds were close but not yet the same. Your {father} finished the sixth at dawn.",
   "You played at three temple fairs. Your father tuned the last reeds alone.": "You played at three temple fairs. Your {father} tuned the last reeds alone.",
   "You kept to your books. Your father worked by lamp light to finish on time.": "You kept to your books. Your {father} worked by lamp light to finish on time."
  }
 },
 "west_mill": {
  "strings": {
   "In the crushing season the sugar mill runs day and night and the cane trucks queue down the road. The mill pays extra for the night crew. Your mother says the dust gets into your chest.": "In the crushing season the sugar mill runs day and night and the cane trucks queue down the road. The mill pays extra for the night crew. Your {mother} says the dust gets into your chest.",
   "You stayed on days. Your mother stopped mentioning the dust.": "You stayed on days. Your {mother} stopped mentioning the dust.",
   "You worked nights until the last truck. Your mother boiled herbs for your cough.": "You worked nights until the last truck. Your {mother} boiled herbs for your cough."
  }
 },
 "west_sampan": {
  "strings": {
   "Your mother sells fruit from a small wooden sampan on the canals, in a blue shirt and a straw hat. The market is busiest from seven to nine. She asks you to paddle while she sells.": "Your {mother} sells fruit from a small wooden sampan on the canals, in a blue shirt and a straw hat. The market is busiest from seven to nine. {She} asks you to paddle while {she} sells.",
   "Paddle for her": "Paddle for {her}",
   "You learned to hold the boat still in a crowd of boats. Your mother sold out by nine.": "You learned to hold the boat still in a crowd of boats. Your {mother} sold out by nine.",
   "You went to school. Your mother paddled and sold at once, and sold less.": "You went to school. Your {mother} paddled and sold at once, and sold less.",
   "Sell while she paddles": "Sell while {she} paddles"
  }
 },
 "south_harbour": {
  "strings": {
   "Your father's boat goes out before dawn from the harbour. The crew is one short this season. Your mother wants you to finish school.": "Your {father}'s boat goes out before dawn from the harbour. The crew is one short this season. Your {mother} wants you to finish school.",
   "You finished school. Your father took a neighbour's son on the crew.": "You finished school. Your {father} took a neighbour's son on the crew.",
   "You learned to sleep on the deck between hauls. Your mother kept your school uniform folded.": "You learned to sleep on the deck between hauls. Your {mother} kept your school uniform folded.",
   "You mended nets on the harbour wall. Your father said your knots held better than his.": "You mended nets on the harbour wall. Your {father} said your knots held better than his."
  },
  "custom": {
   "You mended nets on the harbour wall. Your father said your knots held better than his.": {
    "GM": "You mended nets on the harbour wall. Your grandmother said your knots held better than hers.",
    "MM": "You mended nets on the harbour wall. Your other mother said your knots held better than hers."
   }
  },
  "customLang": {
   "You mended nets on the harbour wall. Your father said your knots held better than his.": {
    "GM": {
     "th": "คุณซ่อมอวนอยู่บนกำแพงท่าเรือ ยายบอกว่าปมของคุณแน่นกว่าของยาย",
     "zh-CN": "你在港口的堤上补网。 外婆说你打的结比她的还牢。",
     "ja": "港の岸壁で網を繕った。 祖母は、あなたの結び目のほうが自分のよりしっかりしていると言った。",
     "ko": "항구 방파제에서 그물을 기웠다. 할머니는 당신의 매듭이 자기 것보다 단단하다고 했다."
    },
    "MM": {
     "th": "คุณซ่อมอวนอยู่บนกำแพงท่าเรือ แม่อีกคนบอกว่าปมของคุณแน่นกว่าของแม่อีกคน",
     "zh-CN": "你在港口的堤上补网。 另一位母亲说你打的结比她的还牢。",
     "ja": "港の岸壁で網を繕った。 もう一人の母は、あなたの結び目のほうが自分のよりしっかりしていると言った。",
     "ko": "항구 방파제에서 그물을 기웠다. 다른 어머니는 당신의 매듭이 자기 것보다 단단하다고 했다."
    }
   }
  }
 },
 "central_pottery": {
  "strings": {
   "Your mother throws earthenware pots on a wheel on Ko Kret. They dry in rows in the shade before they go into the kiln. She asks you to carve the pattern round the necks.": "Your {mother} throws earthenware pots on a wheel on Ko Kret. They dry in rows in the shade before they go into the kiln. {She} asks you to carve the pattern round the necks.",
   "Your first necks were crooked. Your mother sold them anyway, cheaper.": "Your first necks were crooked. Your {mother} sold them anyway, cheaper.",
   "You swam until dark. Your mother carved every neck herself.": "You swam until dark. Your {mother} carved every neck {herself}."
  }
 },
 "h_nang_talung": {
  "strings": {
   "A nang talung troupe has put up a white screen at the temple fair. One man does every voice, and the clown has just said something about the headman. Your mother says be home before midnight.": "A nang talung troupe has put up a white screen at the temple fair. One man does every voice, and the clown has just said something about the headman. Your {mother} says be home before midnight.",
   "You stayed. You could do the clown for weeks. Your mother did not speak to you until Sunday.": "You stayed. You could do the clown for weeks. Your {mother} did not speak to you until Sunday."
  }
 },
 "h_film_van": {
  "strings": {
   "A van has come to the temple with a projector. The voices are done live by two people behind the screen. Your mother says be home before the second reel.": "A van has come to the temple with a projector. The voices are done live by two people behind the screen. Your {mother} says be home before the second reel.",
   "You stayed. You could do both voices for weeks. Your mother did not speak to you until Sunday.": "You stayed. You could do both voices for weeks. Your {mother} did not speak to you until Sunday."
  }
 },
 "h_forest_end": {
  "strings": {
   "A soldier your own age gave you rice and a form. Your mother did not know you until you spoke.": "A soldier your own age gave you rice and a form. Your {mother} did not know you until you spoke."
  }
 },
 "h_vietnam": {
  "strings": {
   "You drew red. The army wants volunteers for South Vietnam, and the pay is more than your father has ever seen at once. A boy in your intake says the Americans have ice cream.": "You drew red. The army wants volunteers for South Vietnam, and the pay is more than your {father} has ever seen at once. A boy in your intake says the Americans have ice cream.",
   "You bought your parents a roof. You do not sit with your back to a door.": "You bought your {parents} a roof. You do not sit with your back to a door."
  },
  "customLang": {
   "You drew red. The army wants volunteers for South Vietnam, and the pay is more than your father has ever seen at once. A boy in your intake says the Americans have ice cream.": {
    "MM": {
     "th": "คุณจับได้ใบแดง กองทัพต้องการอาสาสมัครไปเวียดนามใต้ ค่าตอบแทนมากกว่าที่แม่อีกคนของคุณเคยเห็นในคราวเดียว เด็กรุ่นเดียวกันบอกว่าอเมริกันมีไอศกรีม"
    }
   }
  }
 },
 "h_samlor": {
  "gate": [
   "GM"
  ],
  "strings": {
   "The government has said there will be no more pedal samlors in Bangkok. Your father has pedalled one for nine years and still owes on the chain.": "The government has said there will be no more pedal samlors in Bangkok. Your {father} has pedalled one for nine years and still owes on the chain.",
   "You went to school. He sold it to a man from up-country and came home on foot.": "You went to school. {He} sold it to a man from up-country and came home on foot.",
   "You made four baht the first week and gave your mother three.": "You made four baht the first week and gave your {mother} three.",
   "Ask him for one last ride": "Ask {him} for one last ride",
   "He took you round the block at dusk with the bell going.": "{He} took you round the block at dusk with the bell going."
  }
 },
 "b_ddt": {
  "strings": {
   "Men with tanks on their backs are spraying every house for malaria. They ask who has had fever. Your sister has, and your mother has told you not to say so.": "Men with tanks on their backs are spraying every house for malaria. They ask who has had fever. Your sister has, and your {mother} has told you not to say so.",
   "They gave her small white pills. Your mother did not speak at supper.": "They gave her small white pills. Your {mother} did not speak at supper."
  }
 },
 "b_tv_window": {
  "strings": {
   "You fetched the ice. Your mother looked at the clock and found nothing to say.": "You fetched the ice. Your {mother} looked at the clock and found nothing to say."
  }
 },
 "h_talumphuk": {
  "strings": {
   "The two of you stood on the rice bin until the water went down. She never mentioned it to your mother.": "The two of you stood on the rice bin until the water went down. She never mentioned it to your {mother}."
  },
  "custom": {
   "The two of you stood on the rice bin until the water went down. She never mentioned it to your mother.": {
    "GF": "The two of you stood on the rice bin until the water went down. She never mentioned it to your father."
   }
  },
  "customLang": {
   "The two of you stood on the rice bin until the water went down. She never mentioned it to your mother.": {
    "GF": {
     "th": "สองคนยืนบนถังข้าวจนน้ำลด ย่าไม่เคยเล่าให้พ่อฟัง",
     "zh-CN": "你们俩站在米柜上，直到水退下去。这事她从没跟你父亲提过。",
     "ja": "二人で米びつの上に立って、水が引くのを待った。祖母はそのことを父に一度も話さなかった。",
     "ko": "둘이서 쌀통 위에 올라서서 물이 빠질 때까지 버텼다. 할머니는 아버지에게 그 일을 한 번도 말하지 않았다."
    }
   }
  }
 },
 "b_left_behind": {
  "strings": {
   "Your mother came home at Songkran for years. One year you called her auntie by mistake, and neither of you laughed.": "Your {mother} came home at Songkran for years. One year you called {her} auntie by mistake, and neither of you laughed."
  },
  "custom": {
   "Your parents are going to Bangkok for work. There is room for one child in the room they have found. Your grandmother says she can manage the rest.": {
    "GM": "Your mother is going to Bangkok for work. There is room for one child in the room she has found. Your grandmother says she can manage the rest.",
    "GF": "Your father is going to Bangkok for work. There is room for one child in the room he has found. Your grandmother says she can manage the rest."
   },
   "Your mother came home at Songkran for years. One year you called her auntie by mistake, and neither of you laughed.": {
    "GF": "Your father came home at Songkran for years. One year you called him uncle by mistake, and neither of you laughed.",
    "FF": "Your other father came home at Songkran for years. One year you called him uncle by mistake, and neither of you laughed."
   },
   "You stood at the bus stop with the bag of sticky rice they had forgotten.": {
    "GM": "You stood at the bus stop with the bag of sticky rice she had forgotten.",
    "GF": "You stood at the bus stop with the bag of sticky rice he had forgotten."
   },
   "Go with them": {
    "GM": "Go with her",
    "GF": "Go with him"
   }
  },
  "customLang": {
   "Your parents are going to Bangkok for work. There is room for one child in the room they have found. Your grandmother says she can manage the rest.": {
    "GM": {
     "th": "แม่จะไปหางานในกรุงเทพฯ ห้องที่หาได้มีที่ให้ลูกคนเดียว ยายบอกว่าที่เหลือดูแลเอง",
     "zh-CN": "母亲要去曼谷打工。她找的那间屋只容得下一个孩子。外婆说其余的她带得过来。",
     "ja": "母がバンコクへ働きに出る。見つけた部屋には子どもがひとりしか入らない。ほかの子は見られると祖母は言う。",
     "ko": "어머니가 일하러 방콕으로 간다. 구해 놓은 방에는 아이 하나 들어갈 자리밖에 없다. 할머니는 나머지는 자기가 돌보겠다고 한다."
    },
    "GF": {
     "th": "พ่อจะไปหางานในกรุงเทพฯ ห้องที่หาได้มีที่ให้ลูกคนเดียว ยายบอกว่าที่เหลือดูแลเอง",
     "zh-CN": "父亲要去曼谷打工。他找的那间屋只容得下一个孩子。奶奶说其余的她带得过来。",
     "ja": "父がバンコクへ働きに出る。見つけた部屋には子どもがひとりしか入らない。ほかの子は見られると祖母は言う。",
     "ko": "아버지가 일하러 방콕으로 간다. 구해 놓은 방에는 아이 하나 들어갈 자리밖에 없다. 할머니는 나머지는 자기가 돌보겠다고 한다."
    }
   },
   "Your mother came home at Songkran for years. One year you called her auntie by mistake, and neither of you laughed.": {
    "GF": {
     "th": "พ่อกลับมาสงกรานต์อยู่หลายปี ปีหนึ่งคุณเผลอเรียกพ่อว่าลุง ไม่มีใครหัวเราะ",
     "zh-CN": "好些年，父亲只在泼水节回来。有一年你错叫了他一声叔叔，两个人都没笑。",
     "ja": "父は何年も、ソンクラーンには帰ってきた。ある年、間違えておじさんと呼んだ。どちらも笑わなかった。",
     "ko": "아버지는 몇 년 동안 송끄란이면 집에 왔다. 한 해는 아버지를 삼촌이라고 잘못 불렀고, 둘 다 웃지 않았다."
    },
    "FF": {
     "th": "พ่ออีกคนกลับมาสงกรานต์อยู่หลายปี ปีหนึ่งคุณเผลอเรียกเขาว่าลุง ไม่มีใครหัวเราะ",
     "zh-CN": "好些年，另一位父亲只在泼水节回来。有一年你错叫了他一声叔叔，两个人都没笑。",
     "ja": "もう一人の父は何年も、ソンクラーンには帰ってきた。ある年、間違えておじさんと呼んだ。どちらも笑わなかった。",
     "ko": "다른 아버지는 몇 년 동안 송끄란이면 집에 왔다. 한 해는 다른 아버지를 삼촌이라고 잘못 불렀고, 둘 다 웃지 않았다."
    }
   },
   "You stood at the bus stop with the bag of sticky rice they had forgotten.": {
    "GM": {
     "th": "คุณยืนอยู่ที่ป้ายรถ มือถือถุงข้าวเหนียวที่แม่ลืมไว้",
     "zh-CN": "你站在车站，手里是她忘带的那袋糯米饭。",
     "ja": "バス停に立っていた。手には、母が忘れていったもち米の袋があった。",
     "ko": "어머니가 잊고 간 찰밥 봉지를 들고 버스 정류장에 서 있었다."
    },
    "GF": {
     "th": "คุณยืนอยู่ที่ป้ายรถ มือถือถุงข้าวเหนียวที่พ่อลืมไว้",
     "zh-CN": "你站在车站，手里是他忘带的那袋糯米饭。",
     "ja": "バス停に立っていた。手には、父が忘れていったもち米の袋があった。",
     "ko": "아버지가 잊고 간 찰밥 봉지를 들고 버스 정류장에 서 있었다."
    }
   },
   "Go with them": {
    "GM": {
     "th": "ไปกับแม่",
     "zh-CN": "跟她走",
     "ja": "母についていく",
     "ko": "같이 간다"
    },
    "GF": {
     "th": "ไปกับพ่อ",
     "zh-CN": "跟他走",
     "ja": "父についていく",
     "ko": "같이 간다"
    }
   }
  }
 },
 "b_top_up": {
  "strings": {
   "Your mother's phone": "Your {mother}'s phone",
   "Your mother lets you use her phone for homework. A game has asked for ninety-nine baht and the button is right there. That is her top-up for the week.": "Your {mother} lets you use {her's} phone for homework. A game has asked for ninety-nine baht and the button is right there. That is {her's} top-up for the week.",
   "Her phone stopped working at the market on Thursday. She walked back to ask the price.": "Her phone stopped working at the market on Thursday. {She} walked back to ask the price."
  },
  "custom": {
   "Her phone stopped working at the market on Thursday. She walked back to ask the price.": {
    "FF": "His phone stopped working at the market on Thursday. He walked back to ask the price."
   }
  },
  "customLang": {
   "Her phone stopped working at the market on Thursday. She walked back to ask the price.": {
    "FF": {
     "th": "วันพฤหัสฯ มือถือพ่ออีกคนใช้ไม่ได้กลางตลาด พ่ออีกคนเดินกลับไปถามราคาเอง",
     "zh-CN": "星期四他的手机在市场上没法用了。他只好走回去问价钱。",
     "ja": "木曜、市場でもう一人の父の電話が止まった。もう一人の父は値段を訊きに歩いて戻った。",
     "ko": "목요일에 시장에서 다른 아버지의 전화기가 먹통이 되었다. 다른 아버지는 값을 물으러 걸어서 되돌아갔다."
    }
   }
  }
 },
 "b_driver_son": {
  "strings": {
   "The driver's son is your age and quicker at sums than you are. Your mother has noticed you playing together and has said nothing yet.": "The driver's son is your age and quicker at sums than you are. Your {mother} has noticed you playing together and has said nothing yet.",
   "Stop before she says something": "Stop before {she} says something"
  }
 },
 "b_lady_bangkok": {
  "strings": {
   "A lady from Bangkok wants a girl to mind her children. She will pay your father a year in advance. Your teacher has said you could go on, if someone paid.": "A lady from Bangkok wants a girl to mind her children. She will pay your {father} a year in advance. Your teacher has said you could go on, if someone paid.",
   "The lady took your cousin. Your father did not mention the money again.": "The lady took your cousin. Your {father} did not mention the money again.",
   "Ask your teacher to speak to your father": "Ask your teacher to speak to your {father}",
   "She came on her bicycle and sat on the step for an hour. He gave her water.": "She came on her bicycle and sat on the step for an hour. {He} gave her water."
  },
  "custom": {
   "She came on her bicycle and sat on the step for an hour. He gave her water.": {
    "GM": "She came on her bicycle and sat on the step for an hour. Your grandmother gave her water.",
    "MM": "She came on her bicycle and sat on the step for an hour. Your other mother gave her water."
   }
  },
  "customLang": {
   "She came on her bicycle and sat on the step for an hour. He gave her water.": {
    "GM": {
     "th": "ครูปั่นจักรยานมา นั่งที่บันไดอยู่ชั่วโมงหนึ่ง ยายยกน้ำให้",
     "zh-CN": "她骑自行车来，在台阶上坐了一个钟头。你外婆给她倒了水。",
     "ja": "先生は自転車で来て、一時間、上がり段に座っていた。祖母は水を出した。",
     "ko": "선생님은 자전거를 타고 와서 한 시간 동안 계단에 앉아 있었다. 할머니는 물을 내주었다."
    },
    "MM": {
     "th": "ครูปั่นจักรยานมา นั่งที่บันไดอยู่ชั่วโมงหนึ่ง แม่อีกคนยกน้ำให้",
     "zh-CN": "她骑自行车来，在台阶上坐了一个钟头。你另一位母亲给她倒了水。",
     "ja": "先生は自転車で来て、一時間、上がり段に座っていた。もう一人の母は水を出した。",
     "ko": "선생님은 자전거를 타고 와서 한 시간 동안 계단에 앉아 있었다. 다른 어머니는 물을 내주었다."
    }
   }
  }
 },
 "b_one_more_year": {
  "strings": {
   "Your form teacher has come to the house to say you should stay on. Your father has given her a chair. He has not said anything, and the fees are due on Monday.": "Your form teacher has come to the house to say you should stay on. Your {father} has given her a chair. {He} has not said anything, and the fees are due on Monday."
  }
 },
 "b_draft": {
  "strings": {
   "You had drawn black. Your mother gave a meal to the monks and you got drunk behind the district office.": "You had drawn black. Your {mother} gave a meal to the monks and you got drunk behind the district office."
  }
 },
 "b_draft_south": {
  "strings": {
   "You drew red, and your batch has been told Narathiwat. A cousin knows a colonel who can move a name. He wants a month of your father's income.": "You drew red, and your batch has been told Narathiwat. A cousin knows a colonel who can move a name. He wants a month of your {father}'s income."
  }
 },
 "b_ordain": {
  "strings": {
   "Your mother has been waiting for this since you were born. Three months in robes, and she believes she can hold on to the hem. Your job will not wait three months.": "Your {mother} has been waiting for this since you were born. Three months in robes, and {she} believes {she} can hold on to the hem. Your job will not wait three months.",
   "You shaved on a Friday. She made the same curry she would have made for three months.": "You shaved on a Friday. {She} made the same curry {she} would have made for three months.",
   "You lost the job. On the last morning she could not stop touching your sleeve.": "You lost the job. On the last morning {she} could not stop touching your sleeve.",
   "Tell her you cannot": "Tell {her} you cannot",
   "She said it did not matter and folded the white cloth back into the cupboard.": "{She} said it did not matter and folded the white cloth back into the cupboard."
  }
 },
 "b_nurses": {
  "strings": {
   "American hospitals want Thai nurses. A recruiter has come to your college with forms and a photograph of snow. Your mother needs someone to take her to the clinic in the mornings.": "American hospitals want Thai nurses. A recruiter has come to your college with forms and a photograph of snow. Your {mother} needs someone to take {her} to the clinic in the mornings.",
   "You sent the money for your mother's house. You saw it finished in a photograph.": "You sent the money for your {mother}'s house. You saw it finished in a photograph."
  }
 },
 "b_midwife": {
  "strings": {
   "She came with her bamboo knife and lit the charcoal. Your sister lay by the fire for a week because your mother said so.": "She came with her bamboo knife and lit the charcoal. Your sister lay by the fire for a week because your {mother} said so."
  }
 },
 "b_sister_money": {
  "strings": {
   "She sat at the end of the mat. Your father asked about the hotel.": "She sat at the end of the mat. Your {father} asked about the hotel."
  }
 },
 "b_german_husband": {
  "strings": {
   "You sent money home from Essen. Your mother answered the phone in a voice you did not know.": "You sent money home from Essen. Your {mother} answered the phone in a voice you did not know.",
   "He came in November with a dictionary. Your mother cooked and he ate everything, and then he was ill.": "He came in November with a dictionary. Your {mother} cooked and he ate everything, and then he was ill."
  }
 },
 "b_overtime_sheet": {
  "strings": {
   "The union is asking people on your line to refuse Sunday overtime until the rate is paid. The foreman has a list. Your rent is due, and your mother's medicine.": "The union is asking people on your line to refuse Sunday overtime until the rate is paid. The foreman has a list. Your rent is due, and your {mother}'s medicine."
  }
 },
 "b_land_title": {
  "strings": {
   "The titling team is in the district. Your side of the boundary has been a ditch and a mango tree for forty years. Your neighbour has already moved the marker, and he is your mother's cousin.": "The titling team is in the district. Your side of the boundary has been a ditch and a mango tree for forty years. Your neighbour has already moved the marker, and he is your {mother}'s cousin."
  }
 },
 "b_taxi_lease": {
  "strings": {
   "You put your mother's name and your lottery numbers on the sun visor.": "You put your {mother}'s name and your lottery numbers on the sun visor."
  }
 },
 "b_district_fee": {
  "strings": {
   "He folded it into his top pocket and asked after your mother.": "He folded it into his top pocket and asked after your {mother}."
  },
  "customLang": {
   "He folded it into his top pocket and asked after your mother.": {
    "FF": {
     "th": "เขาพับใส่กระเป๋าเสื้อแล้วถามถึงพ่ออีกคนของคุณ"
    }
   }
  }
 },
 "b_taiwan": {
  "strings": {
   "An agent offers a factory contract in Taiwan. The fee is two years of what you earn here, and the bank will lend it against your parents' land. Your mother has started to forget where she put things.": "An agent offers a factory contract in Taiwan. The fee is two years of what you earn here, and the bank will lend it against your parents' land. Your {mother} has started to forget where {she} put things.",
   "You took her to the clinic on Thursdays. A neighbour's new house went up behind the clinic.": "You took {her} to the clinic on Thursdays. A neighbour's new house went up behind the clinic.",
   "You paid off the land and built two rooms. Your mother called you by your brother's name.": "You paid off the land and built two rooms. Your {mother} called you by your brother's name."
  },
  "custom": {
   "An agent offers a factory contract in Taiwan. The fee is two years of what you earn here, and the bank will lend it against your parents' land. Your mother has started to forget where she put things.": {
    "GM": "An agent offers a factory contract in Taiwan. The fee is two years of what you earn here, and the bank will lend it against your family's land. Your mother has started to forget where she put things.",
    "GF": "An agent offers a factory contract in Taiwan. The fee is two years of what you earn here, and the bank will lend it against your family's land. Your grandmother has started to forget where she put things."
   }
  },
  "customLang": {
   "An agent offers a factory contract in Taiwan. The fee is two years of what you earn here, and the bank will lend it against your parents' land. Your mother has started to forget where she put things.": {
    "GM": {
     "th": "นายหน้าเสนอสัญญาโรงงานที่ไต้หวัน ค่านายหน้าเท่ารายได้สองปี แบงก์ให้กู้โดยเอาที่ของครอบครัวค้ำ แม่เริ่มลืมว่าวางของไว้ตรงไหน",
     "zh-CN": "中介介绍一份台湾的工厂合同。中介费是你在这儿两年的收入，银行可以拿你家的地作抵押贷给你。你母亲开始记不住东西放在哪儿了。",
     "ja": "斡旋業者が台湾の工場の契約を持ってきた。手数料はここで稼ぐ二年ぶんで、銀行は家族の土地を担保に貸してくれる。母はものを置いた場所を忘れるようになった。",
     "ko": "브로커가 대만 공장 계약을 권한다. 수수료는 여기서 버는 돈의 이 년 치고, 은행은 가족 땅을 담보로 빌려준다. 어머니는 물건 둔 곳을 잊기 시작했다."
    },
    "GF": {
     "th": "นายหน้าเสนอสัญญาโรงงานที่ไต้หวัน ค่านายหน้าเท่ารายได้สองปี แบงก์ให้กู้โดยเอาที่ของครอบครัวค้ำ ย่าเริ่มลืมว่าวางของไว้ตรงไหน",
     "zh-CN": "中介介绍一份台湾的工厂合同。中介费是你在这儿两年的收入，银行可以拿你家的地作抵押贷给你。你奶奶开始记不住东西放在哪儿了。",
     "ja": "斡旋業者が台湾の工場の契約を持ってきた。手数料はここで稼ぐ二年ぶんで、銀行は家族の土地を担保に貸してくれる。祖母はものを置いた場所を忘れるようになった。",
     "ko": "브로커가 대만 공장 계약을 권한다. 수수료는 여기서 버는 돈의 이 년 치고, 은행은 가족 땅을 담보로 빌려준다. 할머니는 물건 둔 곳을 잊기 시작했다."
    },
    "FF": {
     "th": "นายหน้าเสนอสัญญาโรงงานที่ไต้หวัน ค่านายหน้าเท่ารายได้สองปี แบงก์ให้กู้โดยเอาที่ของพ่อทั้งสองคนค้ำ พ่ออีกคนเริ่มลืมว่าวางของไว้ตรงไหน",
     "zh-CN": "中介介绍一份台湾的工厂合同。中介费是你在这儿两年的收入，银行可以拿你双亲的地作抵押贷给你。你另一位父亲开始记不住东西放在哪儿了。"
    }
   }
  }
 },
 "b_brother_home": {
  "strings": {
   "Your brother has come home from driving trucks, thin, with sores he covers with a long-sleeved shirt in April. The market has stopped buying your mother's sweets.": "Your brother has come home from driving trucks, thin, with sores he covers with a long-sleeved shirt in April. The market has stopped buying your {mother}'s sweets."
  }
 },
 "b_thirty_baht": {
  "strings": {
   "You have a new card and it says thirty baht. Your mother's eyes have been white for three years. The district hospital starts giving out queue numbers at five in the morning, and the private clinic can see her on Tuesday.": "You have a new card and it says thirty baht. Your {mother}'s eyes have been white for three years. The district hospital starts giving out queue numbers at five in the morning, and the private clinic can see {her} on Tuesday.",
   "Take her for a queue number": "Take {her} for a queue number",
   "You sat on a bench from five until two. They did the first eye in October, and she told you what colour your shirt was.": "You sat on a bench from five until two. They did the first eye in October, and {she} told you what colour your shirt was.",
   "It took forty minutes. She asked how much and you said thirty baht.": "It took forty minutes. {She} asked how much and you said thirty baht.",
   "She had stopped asking. She knew the house by the corners.": "{She} had stopped asking. {She} knew the house by the corners."
  }
 },
 "b_mule": {
  "strings": {
   "The police letter came to your mother's house. A pensioner in Lampang had sent four hundred thousand through your name.": "The police letter came to your {mother}'s house. A pensioner in Lampang had sent four hundred thousand through your name."
  }
 },
 "b_mother_fell": {
  "strings": {
   "Your mother has fallen": "Your {mother} has fallen",
   "A neighbour rings to say your mother has fallen in the bathroom again. She says she is fine. It is a night bus away and you have used your leave, and your brother says it is your turn.": "A neighbour rings to say your {mother} has fallen in the bathroom again. {She} says {she} is fine. It is a night bus away and you have used your leave, and your brother says it is your turn.",
   "Ring her and ask the neighbour to look in": "Ring {her} and ask the neighbour to look in",
   "She said she was fine. The neighbour said she had seen worse.": "{She} said {she} was fine. The neighbour said she had seen worse.",
   "Send money for someone to look in on her": "Send money for someone to look in on {her}",
   "A girl from the next village came twice a week. Your mother told you she was very good and did not say her name.": "A girl from the next village came twice a week. Your {mother} told you she was very good and did not say her name.",
   "Bring her to live with you in the city": "Bring {her} to live with you in the city",
   "She sat at the window of a building where nobody knew her. She asked when she could go home.": "{She} sat at the window of a building where nobody knew {her}. {She} asked when {she} could go home.",
   "She brought her own pillow and a jar of pla ra the neighbours complained about.": "{She} brought {her's} own pillow and a jar of pla ra the neighbours complained about.",
   "You put a rail in the bathroom. You learned how she liked the rice.": "You put a rail in the bathroom. You learned how {she} liked the rice."
  },
  "customLang": {
   "She said she was fine. The neighbour said she had seen worse.": {
    "FF": {
     "zh-CN": "他说没事。邻居说比这厉害的也见过。"
    }
   }
  }
 },
 "b_inflation_savings": {
  "strings": {
   "You took two baht-weight back to the same shop. The woman remembered your mother.": "You took two baht-weight back to the same shop. The woman remembered your {mother}."
  },
  "customLang": {
   "You took two baht-weight back to the same shop. The woman remembered your mother.": {
    "FF": {
     "th": "คุณเอาทองสองบาทกลับไปร้านเดิม เธอยังจำพ่ออีกคนของคุณได้"
    }
   }
  }
 },
 "b_slump_owner": {
  "strings": {
   "Your orders have gone to nothing. You can let thirty people go this month, or sell the house and pay them until something changes. Your head of accounts started with your father.": "Your orders have gone to nothing. You can let thirty people go this month, or sell the house and pay them until something changes. Your head of accounts started with your {father}.",
   "The orders never came. You paid the last month out of your mother's gold.": "The orders never came. You paid the last month out of your {mother}'s gold.",
   "You moved your family above the warehouse. Your mother asked about the garden.": "You moved your family above the warehouse. Your {mother} asked about the garden."
  }
 },
 "b_dollar_debt": {
  "strings": {
   "You signed in English. Your father's portrait came home in the back of a taxi.": "You signed in English. Your {father}'s portrait came home in the back of a taxi."
  }
 },
 "h_covid_home": {
  "strings": {
   "You spent fourteen days in a hut in the rice field. Your mother left the food at the bund and waved.": "You spent fourteen days in a hut in the rice field. Your {mother} left the food at the bund and waved.",
   "Your father held it up to the camera, on the wrong finger.": "Your {father} held it up to the camera, on the wrong finger."
  },
  "custom": {
   "Your workplace has closed for a third time and the wave has reached your floor. Your parents are in their seventies and unvaccinated. You could go home. You could also be the one who brings it.": {
    "GM": "Your workplace has closed for a third time and the wave has reached your floor. Your mother and grandmother are old and unvaccinated. You could go home. You could also be the one who brings it.",
    "GF": "Your workplace has closed for a third time and the wave has reached your floor. Your father and grandmother are old and unvaccinated. You could go home. You could also be the one who brings it."
   }
  },
  "customLang": {
   "Your workplace has closed for a third time and the wave has reached your floor. Your parents are in their seventies and unvaccinated. You could go home. You could also be the one who brings it.": {
    "GM": {
     "th": "ที่ทำงานปิดรอบสาม ระลอกนี้ถึงชั้นคุณแล้ว แม่กับยายแก่แล้ว ยังไม่ได้วัคซีน คุณกลับบ้านได้ คุณก็อาจเป็นคนเอาเชื้อไป",
     "zh-CN": "你的单位第三次关门，疫情到了你这一层。你母亲和外婆年纪大了，没打疫苗。你可以回家。你也可能就是把它带回去的人。",
     "ja": "職場は三度目の閉鎖になり、波はこの階まで来た。母と祖母は高齢で、ワクチンを打っていない。帰ることはできる。持ち帰る本人になることもできる。",
     "ko": "직장이 세 번째로 닫혔고 파도는 사는 층까지 왔다. 어머니와 할머니는 연로하고 백신을 맞지 않았다. 고향에 갈 수 있다. 옮기는 사람이 될 수도 있다."
    },
    "GF": {
     "th": "ที่ทำงานปิดรอบสาม ระลอกนี้ถึงชั้นคุณแล้ว พ่อกับย่าแก่แล้ว ยังไม่ได้วัคซีน คุณกลับบ้านได้ คุณก็อาจเป็นคนเอาเชื้อไป",
     "zh-CN": "你的单位第三次关门，疫情到了你这一层。你父亲和奶奶年纪大了，没打疫苗。你可以回家。你也可能就是把它带回去的人。",
     "ja": "職場は三度目の閉鎖になり、波はこの階まで来た。父と祖母は高齢で、ワクチンを打っていない。帰ることはできる。持ち帰る本人になることもできる。",
     "ko": "직장이 세 번째로 닫혔고 파도는 사는 층까지 왔다. 아버지와 할머니는 연로하고 백신을 맞지 않았다. 고향에 갈 수 있다. 옮기는 사람이 될 수도 있다."
    }
   }
  }
 },
 "b_condo_bts": {
  "strings": {
   "A studio of twenty-eight square metres is four hundred metres from the station, and the bank will lend you all of it for thirty years. The commute now takes you three hours a day. Your parents have a house with room for you.": "A studio of twenty-eight square metres is four hundred metres from the station, and the bank will lend you all of it for thirty years. The commute now takes you three hours a day. Your {parents} have a house with room for you.",
   "Stay with your parents": "Stay with your {parents}",
   "You left at five thirty. Your mother had put the rice in a box.": "You left at five thirty. Your {mother} had put the rice in a box."
  }
 },
 "sc_letter_home": {
  "strings": {
   "You are working far from home. Your mother wants to know whether you are all right. The next letter leaves tonight.": "You are working far from home. Your {mother} wants to know whether you are all right. The next letter leaves tonight.",
   "What you write becomes what she knows for two weeks.": "What you write becomes what {she} knows for two weeks.",
   "She reads it and believes it, and keeps a worry she cannot put down.": "{She} reads it and believes it, and keeps a worry {she} cannot put down.",
   "You said all was well. She believed you, and kept a worry she could not put down.": "You said all was well. {She} believed you, and kept a worry {she} could not put down.",
   "Tell her the truth": "Tell {her} the truth",
   "She knows what is true, and now she knows it is true.": "{She} knows what is true, and now {she} knows it is true.",
   "You told her the truth. She knew what was true, and now she knew it was true.": "You told {her} the truth. {She} knew what was true, and now {she} knew it was true.",
   "You sent only money. It said nothing, and it said everything, and she read it wrong.": "You sent only money. It said nothing, and it said everything, and {she} read it wrong."
  },
  "customLang": {
   "What you write becomes what she knows for two weeks.": {
    "FF": {
     "ko": "당신이 쓴 것은 이 주일 동안 그가 알게 되는 모든 것이다."
    }
   }
  }
 },
 "sc_drug_list": {
  "strings": {
   "The doctor names medicines that cannot be found in this country. Your mother is ill, and the list is in your hand.": "The doctor names medicines that cannot be found in this country. Your {mother} is ill, and the list is in your hand.",
   "You stop looking. You stay with her instead.": "You stop looking. You stay with {her} instead.",
   "You accepted that this was the cost, and stopped looking, and stayed with her instead.": "You accepted that this was the cost, and stopped looking, and stayed with {her} instead."
  }
 },
 "sc_not_worth_that": {
  "strings": {
   "Your mother is ill. The medicine costs more than the house is worth. She does the sum out loud, so that you will not spend it on her.": "Your {mother} is ill. The medicine costs more than the house is worth. {She} does the sum out loud, so that you will not spend it on {her}.",
   "She is telling you the truth about your life, and about hers.": "{She} is telling you the truth about your life, and about {hers}.",
   "She calculates so that you will not.": "{She} calculates so that you will not.",
   "Honour her wish": "Honour {her's} wish",
   "You honoured her wish. You kept the money, and you kept the sentence.": "You honoured {her's} wish. You kept the money, and you kept the sentence.",
   "You spend it. She is alive, and the money and the years are gone.": "You spend it. {She} is alive, and the money and the years are gone.",
   "You spent it anyway. She was alive, and the money and the years were gone.": "You spent it anyway. {She} was alive, and the money and the years were gone."
  },
  "customLang": {
   "Your mother is ill. The medicine costs more than the house is worth. She does the sum out loud, so that you will not spend it on her.": {
    "GF": {
     "ko": "할머니가 아프십니다. 약값이 집값보다 큽니다. 그녀는 금액을 소리 내어 계산하여, 당신이 그녀에게 쓰지 않게 했습니다."
    }
   }
  }
 },
 "d_limb": {
  "strings": {
   "You remember the road and then the ceiling. Someone has folded the blanket flat where your left leg should be. Your mother has been told to speak first.": "You remember the road and then the ceiling. Someone has folded the blanket flat where your left leg should be. Your {mother} has been told to speak first."
  },
  "customLang": {
   "You remember the road and then the ceiling. Someone has folded the blanket flat where your left leg should be. Your mother has been told to speak first.": {
    "FF": {
     "zh-CN": "你记得那条路,然后是天花板。左腿该在的地方,被子被人叠得平平的。有人交代了你另一位父亲,让他先开口。"
    }
   }
  }
 },
 "d_evict": {
  "strings": {
   "You now pay rent on your mother’s kitchen.": "You now pay rent on your {mother}’s kitchen."
  }
 },
 "d_father": {
  "strings": {
   "The words he tried to teach you": "The words {he} tried to teach you",
   "Your father grew up speaking a language you never bothered to learn. He tried at dinner, and you rolled your eyes. He never once said you had done well. He is dead now, and a woman at the market just called you something in his dialect and you do not know what it means.": "Your {father} grew up speaking a language you never bothered to learn. {He} tried at dinner, and you rolled your eyes. {He} never once said you had done well. {He} is dead now, and a woman at the market just called you something in {his} dialect and you do not know what it means.",
   "It meant roughly, have you eaten yet. It is what he said every day.": "It meant roughly, have you eaten yet. It is what {he} said every day."
  }
 },
 "s_title": {
  "strings": {
   "The paper in his drawer": "The paper in {his} drawer",
   "Your father handed the land deed to the moneylender years ago against a small loan. The moneylender’s son now says the debt has grown and the land is his. Your family has farmed it for sixty years.": "Your {father} handed the land deed to the moneylender years ago against a small loan. The moneylender’s son now says the debt has grown and the land is his. Your family has farmed it for sixty years.",
   "Four years of forms. You got the deed back, and your father did not live to see it.": "Four years of forms. You got the deed back, and your {father} did not live to see it."
  }
 },
 "s_1997": {
  "strings": {
   "Your mother said nothing about it and killed a chicken.": "Your {mother} said nothing about it and killed a chicken."
  }
 },
 "s_skip": {
  "strings": {
   "Leaving her with your mother": "Leaving her with your {mother}",
   "The factory in Samut Prakan pays three times what anyone pays here, and it has no room for a baby. Your daughter is two. Your mother says go.": "The factory in Samut Prakan pays three times what anyone pays here, and it has no room for a baby. Your daughter is two. Your {mother} says go.",
   "She called your mother Mae. You sent money for fourteen years and she thanked you, politely.": "She called your {mother} Mae. You sent money for fourteen years and she thanked you, politely."
  },
  "custom": {
   "She called your mother Mae. You sent money for fourteen years and she thanked you, politely.": {
    "FF": "She called your other father Pho. You sent money for fourteen years and she thanked you, politely."
   }
  },
  "customLang": {
   "She called your mother Mae. You sent money for fourteen years and she thanked you, politely.": {
    "FF": {
     "th": "เธอเรียกพ่ออีกคนของคุณว่าพ่อ คุณส่งเงินมาสิบสี่ปี และเธอขอบคุณคุณอย่างสุภาพ",
     "zh-CN": "她管你另一位父亲叫 Pho。你寄了十四年的钱,她客客气气地向你道谢。",
     "ja": "娘はあなたのもう一人の父を「Pho」と呼んだ。十四年間、金を送り続け、娘は礼儀正しく礼を言った。",
     "ko": "딸은 당신의 다른 아버지를 \"Pho\"라고 불렀다. 십사 년 동안 돈을 보냈고, 딸은 공손하게 고맙다고 했다."
    },
    "GF": {
     "th": "เธอเรียกย่าของคุณว่าแม่ คุณส่งเงินมาสิบสี่ปี และเธอขอบคุณคุณอย่างสุภาพ"
    }
   }
  }
 },
 "s_abroad": {
  "strings": {
   "A woman from the next village, nicely dressed, has a job for you: waitress, good pay, she will advance the ticket and you pay her back from wages. Your mother’s roof is coming in.": "A woman from the next village, nicely dressed, has a job for you: waitress, good pay, she will advance the ticket and you pay her back from wages. Your {mother}’s roof is coming in."
  }
 },
 "s_pills": {
  "strings": {
   "Your cousin asks you to keep a small packet for two days. You have seen what it is. He paid for your father’s operation. The police are at the end of the soi more than they used to be.": "Your cousin asks you to keep a small packet for two days. You have seen what it is. He paid for your {father}’s operation. The police are at the end of the soi more than they used to be."
  }
 },
 "s_flood": {
  "strings": {
   "The radio says the walls will hold. The neighbours say they will not. Everything the family owns is in that house, and your mother cannot climb stairs.": "The radio says the walls will hold. The neighbours say they will not. Everything the family owns is in that house, and your {mother} cannot climb stairs.",
   "Carry your mother out now": "Carry your {mother} out now"
  }
 },
 "r_scholar_1": {
  "strings": {
   "Your father guts fish at Talat Noi, and your name is first on the list outside the ministry. A government scholarship: economics in London, then twice those years owed back to the civil service. He asks you to read him the part about the money.": "Your {father} guts fish at Talat Noi, and your name is first on the list outside the ministry. A government scholarship: economics in London, then twice those years owed back to the civil service. {He} asks you to read {him} the part about the money."
  }
 },
 "r_scholar_2": {
  "strings": {
   "It took your father’s savings and your brother’s. You have been a private person ever since, and nobody has asked your opinion.": "It took your {father}’s savings and your brother’s. You have been a private person ever since, and nobody has asked your opinion."
  }
 },
 "r_scholar_3": {
  "strings": {
   "You left with a briefcase and have not been back. The ministry sent the unpaid part of your bond to your father, who had signed as guarantor.": "You left with a briefcase and have not been back. The ministry sent the unpaid part of your bond to your {father}, who had signed as guarantor."
  },
  "customLang": {
   "You left with a briefcase and have not been back. The ministry sent the unpaid part of your bond to your father, who had signed as guarantor.": {
    "GM": {
     "zh-CN": "你只提着一个公文包离开,再没回来。部里把奖学金没还清的部分寄给了你外婆,因为她当年是担保人。"
    },
    "MM": {
     "zh-CN": "你只提着一个公文包离开,再没回来。部里把奖学金没还清的部分寄给了你另一位母亲,因为她当年是担保人。"
    }
   }
  }
 },
 "r_luk_thung_1": {
  "strings": {
   "You cut cane from first light, and you know every song on the radio by heart because nobody taught you to read the words. At the temple fair a touring band’s singer has gone home sick, and the bandleader asks who knows the second verse. Your mother is holding the cane money.": "You cut cane from first light, and you know every song on the radio by heart because nobody taught you to read the words. At the temple fair a touring band’s singer has gone home sick, and the bandleader asks who knows the second verse. Your {mother} is holding the cane money."
  }
 },
 "r_boxer_2": {
  "strings": {
   "You have reached the Bangkok circuit, and a promoter offers a title shot if you can drop four kilos in nine days. A man in the third row, whom you have never met, would like the fight to end in the fourth round. Your mother’s roof is leaking.": "You have reached the Bangkok circuit, and a promoter offers a title shot if you can drop four kilos in nine days. A man in the third row, whom you have never met, would like the fight to end in the fourth round. Your {mother}’s roof is leaking."
  },
  "customLang": {
   "You have reached the Bangkok circuit, and a promoter offers a title shot if you can drop four kilos in nine days. A man in the third row, whom you have never met, would like the fight to end in the fourth round. Your mother’s roof is leaking.": {
    "FF": {
     "th": "คุณขึ้นมาถึงสังเวียนกรุงเทพฯ แล้ว โปรโมเตอร์เสนอชิงแชมป์ถ้าคุณลดน้ำหนักได้สี่กิโลในเก้าวัน ชายในแถวที่สามที่คุณไม่เคยเจอหน้าอยากให้การชกจบในยกสี่ หลังคาบ้านพ่ออีกคนของคุณรั่ว"
    }
   }
  }
 },
 "r_novice_1": {
  "strings": {
   "There is no money for upper school, and the abbot says a novice eats and learns for nothing. Your father shaves your head at the well and tells you that you can always leave. Pali starts at five in the morning.": "There is no money for upper school, and the abbot says a novice eats and learns for nothing. Your {father} shaves your head at the well and tells you that you can always leave. Pali starts at five in the morning."
  }
 },
 "r_novice_2": {
  "strings": {
   "Disrobe and go home to your parents": "Disrobe and go home to your {parents}",
   "Your mother cried with relief and then with disappointment. You teach the village children their letters for a small sum, and the sum does not change.": "Your {mother} cried with relief and then with disappointment. You teach the village children their letters for a small sum, and the sum does not change."
  }
 },
 "r_novice_3": {
  "strings": {
   "Word came from the village that your father had died. You went home for the cremation and found the field had been signed over years ago against a debt. Your sister looked at you the way people look at someone with a Bangkok salary, which a monk does not have.": "Word came from the village that your {father} had died. You went home for the cremation and found the field had been signed over years ago against a debt. Your sister looked at you the way people look at someone with a Bangkok salary, which a monk does not have."
  }
 },
 "r_painter_1": {
  "strings": {
   "The district education officer has seen what you drew on the walls of the school and has not punished you, which surprises everybody. The ministry has one scholarship at the art college in Bangkok. Your father wanted someone to keep the accounts at the mill.": "The district education officer has seen what you drew on the walls of the school and has not punished you, which surprises everybody. The ministry has one scholarship at the art college in Bangkok. Your {father} wanted someone to keep the accounts at the mill."
  }
 },
 "r_actor_1": {
  "strings": {
   "You had three lines. Your mother went to the matinee twice and did not recognise the name on the poster.": "You had three lines. Your {mother} went to the matinee twice and did not recognise the name on the poster."
  }
 },
 "r_dancer_1": {
  "strings": {
   "A teacher from the Fine Arts Department’s dance school saw you doing a monkey for your friends at a temple fair. There is a place for you, with a uniform and lunch, and a stick for your knees from dawn. Your parents have asked what it leads to.": "A teacher from the Fine Arts Department’s dance school saw you doing a monkey for your friends at a temple fair. There is a place for you, with a uniform and lunch, and a stick for your knees from dawn. Your {parents} have asked what it leads to."
  },
  "customLang": {
   "A teacher from the Fine Arts Department’s dance school saw you doing a monkey for your friends at a temple fair. There is a place for you, with a uniform and lunch, and a stick for your knees from dawn. Your parents have asked what it leads to.": {
    "GM": {
     "ko": "예술국 무용학교의 선생이 절 축제에서 친구들에게 원숭이 흉내를 내는 당신을 보았다. 자리가 하나 있다. 교복과 점심이 나오고, 동틀 때부터 무릎을 때리는 막대기가 따라온다. 가족은 그게 어디로 이어지느냐고 묻는다."
    },
    "GF": {
     "ko": "예술국 무용학교의 선생이 절 축제에서 친구들에게 원숭이 흉내를 내는 당신을 보았다. 자리가 하나 있다. 교복과 점심이 나오고, 동틀 때부터 무릎을 때리는 막대기가 따라온다. 가족은 그게 어디로 이어지느냐고 묻는다."
    }
   }
  }
 },
 "r_writer_1": {
  "strings": {
   "Your mother sews so that you can stay at school, and a teacher has lent you a novel with the cover torn off. He says it is about people like your mother, and not to carry it on the bus. You have started writing in the back of your arithmetic book.": "Your {mother} sews so that you can stay at school, and a teacher has lent you a novel with the cover torn off. He says it is about people like your {mother}, and not to carry it on the bus. You have started writing in the back of your arithmetic book.",
   "They printed it and paid the price of a pair of shoes. Your mother read it twice and asked whether it was about her.": "They printed it and paid the price of a pair of shoes. Your {mother} read it twice and asked whether it was about {her}."
  },
  "customLang": {
   "Your mother sews so that you can stay at school, and a teacher has lent you a novel with the cover torn off. He says it is about people like your mother, and not to carry it on the bus. You have started writing in the back of your arithmetic book.": {
    "FF": {
     "th": "พ่ออีกคนของคุณเย็บผ้าเพื่อให้คุณได้เรียนต่อ ครูให้ยืมนิยายเล่มหนึ่งที่ปกฉีกหายไป เขาบอกว่าเป็นเรื่องของคนอย่างพ่ออีกคนของคุณ และอย่าถือไปบนรถเมล์ คุณเริ่มเขียนหนังสือไว้ด้านหลังสมุดเลข"
    }
   },
   "They printed it and paid the price of a pair of shoes. Your mother read it twice and asked whether it was about her.": {
    "FF": {
     "th": "เขาตีพิมพ์ให้และจ่ายเงินเท่ารองเท้าหนึ่งคู่ พ่ออีกคนของคุณอ่านสองรอบและถามว่านี่เรื่องของเขาใช่ไหม"
    }
   }
  }
 },
 "r_writer_4": {
  "strings": {
   "The hall stood up, the police did not come, and it went to nine printings. Schoolchildren are now examined on your mother.": "The hall stood up, the police did not come, and it went to nine printings. Schoolchildren are now examined on your {mother}."
  }
 },
 "r_student_1": {
  "strings": {
   "The printers ran two thousand copies. Your father found out from the neighbour who sells him ice.": "The printers ran two thousand copies. Your {father} found out from the neighbour who sells {him} ice."
  },
  "customLang": {
   "The printers ran two thousand copies. Your father found out from the neighbour who sells him ice.": {
    "MM": {
     "th": "โรงพิมพ์พิมพ์ไปสองพันแผ่น แม่อีกคนของคุณรู้จากเพื่อนบ้านที่ขายน้ำแข็งให้"
    }
   }
  }
 },
 "r_student_2": {
  "strings": {
   "You carried rice, read Mao and had malaria three times. Your parents were visited every six months by a man who took notes.": "You carried rice, read Mao and had malaria three times. Your {parents} were visited every six months by a man who took notes."
  },
  "customLang": {
   "You carried rice, read Mao and had malaria three times. Your parents were visited every six months by a man who took notes.": {
    "GM": {
     "ko": "당신은 쌀을 졌고, 마오쩌둥을 읽었고, 말라리아를 세 번 앓았다. 반년마다 수첩을 든 남자가 당신 가족을 찾아왔다."
    },
    "GF": {
     "ko": "당신은 쌀을 졌고, 마오쩌둥을 읽었고, 말라리아를 세 번 앓았다. 반년마다 수첩을 든 남자가 당신 가족을 찾아왔다."
    }
   }
  }
 },
 "r_trader_1": {
  "strings": {
   "Your father sells dried goods from a shophouse in Phichit, and the family sleeps above the sacks. He is taking you out of school this week, because your brother has gone to Bangkok and the ledger needs someone who can count. Your teacher has come to argue and has been given tea.": "Your {father} sells dried goods from a shophouse in Phichit, and the family sleeps above the sacks. {He} is taking you out of school this week, because your brother has gone to Bangkok and the ledger needs someone who can count. Your teacher has come to argue and has been given tea.",
   "You finished school and took the exam for the post office. The shop went to a cousin when your father died, at a family price.": "You finished school and took the exam for the post office. The shop went to a cousin when your {father} died, at a family price."
  }
 },
 "r_trader_2": {
  "strings": {
   "The bank’s man drives up from Bangkok in a new car, offering dollar loans at a rate the old moneylender would laugh at. You could own the warehouse, the trucks and the land by the bypass that everyone says is going up. Your father never owed anyone past the first of the month.": "The bank’s man drives up from Bangkok in a new car, offering dollar loans at a rate the old moneylender would laugh at. You could own the warehouse, the trucks and the land by the bypass that everyone says is going up. Your {father} never owed anyone past the first of the month."
  }
 },
 "r_taxi_4": {
  "strings": {
   "You paid off the last instalment and the car was yours. You put your mother’s photograph on the sun visor and drove nine more years.": "You paid off the last instalment and the car was yours. You put your {mother}’s photograph on the sun visor and drove nine more years."
  }
 },
 "r_abroad_1": {
  "strings": {
   "The neighbour’s son came home from Singapore, and the family now has a concrete house and a fridge. An agent comes through on Thursdays with a list: steel fixers, two years, and a fee worth more than your father’s field. The bank in town will lend against the deed.": "The neighbour’s son came home from Singapore, and the family now has a concrete house and a fridge. An agent comes through on Thursdays with a list: steel fixers, two years, and a fee worth more than your {father}’s field. The bank in town will lend against the deed."
  },
  "customLang": {
   "The neighbour’s son came home from Singapore, and the family now has a concrete house and a fridge. An agent comes through on Thursdays with a list: steel fixers, two years, and a fee worth more than your father’s field. The bank in town will lend against the deed.": {
    "MM": {
     "th": "ลูกชายบ้านข้างๆ กลับมาจากสิงคโปร์ ตอนนี้ครอบครัวนั้นมีบ้านปูน กับตู้เย็น นายหน้าแวะมาทุกวันพฤหัสพร้อมรายชื่อ ช่างผูกเหล็ก สองปี ค่าหัวมากกว่านาของแม่อีกคนของคุณทั้งผืน ธนาคารในเมืองยอมให้กู้โดยเอาโฉนดค้ำ"
    }
   }
  }
 },
 "r_soi_compound_1": {
  "strings": {
   "A boarding school in England has written to your father, and the envelope has a crest. Your friends at the international school are already choosing universities abroad. Khun Yai says a child should know how to write a letter in Thai before leaving.": "A boarding school in England has written to your {father}, and the envelope has a crest. Your friends at the international school are already choosing universities abroad. Khun Yai says a child should know how to write a letter in Thai before leaving."
  },
  "custom": {
   "A boarding school in England has written to your father, and the envelope has a crest. Your friends at the international school are already choosing universities abroad. Khun Yai says a child should know how to write a letter in Thai before leaving.": {
    "GM": "A boarding school in England has written to your mother, and the envelope has a crest. Your friends at the international school are already choosing universities abroad. Khun Yai says a child should know how to write a letter in Thai before leaving."
   }
  },
  "customLang": {
   "A boarding school in England has written to your father, and the envelope has a crest. Your friends at the international school are already choosing universities abroad. Khun Yai says a child should know how to write a letter in Thai before leaving.": {
    "GM": {
     "th": "โรงเรียนประจำในอังกฤษเขียนจดหมายถึงแม่ของคุณ บนซองมีตราประทับ เพื่อนที่โรงเรียนนานาชาติเริ่มเลือกมหาวิทยาลัยต่างประเทศกันแล้ว คุณยายบอกว่าเด็กควรเขียนจดหมายภาษาไทยให้เป็นก่อนจะจากบ้าน",
     "zh-CN": "英国一所寄宿学校给你母亲来了信，信封上印着徽章。国际学校的朋友们已经在挑国外的大学了。外婆说，孩子出门之前，总该会用泰文写一封信。",
     "ja": "イギリスの寄宿学校から母あてに手紙が届いた。封筒には紋章がある。インターナショナルスクールの友人たちは、もう海外の大学を選びはじめている。おばあちゃんは、子どもは国を出る前にタイ語で手紙を書けるようになっておくものだと言う。",
     "ko": "영국의 기숙학교에서 어머니 앞으로 편지가 왔다. 봉투에는 문장이 찍혀 있다. 국제학교 친구들은 벌써 외국 대학을 고르고 있다. 외할머니는 아이가 떠나기 전에 태국어로 편지 한 통은 쓸 줄 알아야 한다고 말한다."
    }
   }
  }
 },
 "r_soi_compound_2": {
  "strings": {
   "Your father has had a desk made for you on the fourth floor, next to the window, with your name on a brass plate. A friend from university wants you in Singapore to build something that is not yet anything. The plate is already screwed on.": "Your {father} has had a desk made for you on the fourth floor, next to the window, with your name on a brass plate. A friend from university wants you in Singapore to build something that is not yet anything. The plate is already screwed on."
  }
 },
 "r_soi_compound_3": {
  "strings": {
   "It cost a year of profit. Half of them came back when the lines restarted, and one of them still brings your mother mangoes.": "It cost a year of profit. Half of them came back when the lines restarted, and one of them still brings your {mother} mangoes."
  },
  "customLang": {
   "It cost a year of profit. Half of them came back when the lines restarted, and one of them still brings your mother mangoes.": {
    "FF": {
     "th": "เสียกำไรไปหนึ่งปี ครึ่งหนึ่งกลับมาเมื่อสายการผลิตเดินอีกครั้ง มีคนหนึ่งยังเอามะม่วงมาฝากพ่ออีกคนของคุณจนทุกวันนี้"
    }
   }
  }
 },
 "r_soi_compound_4": {
  "strings": {
   "Your father has died, and the land on Sukhumvit is in all three of your names. Your sister wants to sell to a developer, and your brother wants to build. Your mother says nothing and has stopped eating dinner with any of you.": "Your {father} has died, and the land on Sukhumvit is in all three of your names. Your sister wants to sell to a developer, and your brother wants to build. Your {mother} says nothing and has stopped eating dinner with any of you.",
   "Sign your share to your mother": "Sign your share to your {mother}",
   "It was the most expensive thing you ever did. She started eating dinner again.": "It was the most expensive thing you ever did. {She} started eating dinner again."
  },
  "customLang": {
   "Your father has died, and the land on Sukhumvit is in all three of your names. Your sister wants to sell to a developer, and your brother wants to build. Your mother says nothing and has stopped eating dinner with any of you.": {
    "GF": {
     "th": "พ่อเสียแล้ว ที่ดินสุขุมวิทเป็นชื่อพี่น้องทั้งสามคน พี่สาวอยากขายให้นักพัฒนาที่ดิน พี่ชายอยากสร้างเอง ย่าไม่พูดอะไร และเลิกกินข้าวเย็นกับหลานทุกคน"
    }
   }
  }
 },
 "r_scholarship_kid_1": {
  "strings": {
   "An aunt at Songkran says it kindly: scholarships are for the clever children, and you should learn a trade. Your father pays for a tutor school on Saturdays with money that was meant for the roof. You have a desk lamp and a stack of old exam papers.": "An aunt at Songkran says it kindly: scholarships are for the clever children, and you should learn a trade. Your {father} pays for a tutor school on Saturdays with money that was meant for the roof. You have a desk lamp and a stack of old exam papers."
  }
 },
 "r_scholarship_kid_2": {
  "strings": {
   "Two letters arrive on the same day. One is a government scholarship: two years abroad, and four years owed back to the service. The other is a foreign university's own money, with no bond and no one to call if it ends. Your father reads the bond page twice and asks who will be your guarantor.": "Two letters arrive on the same day. One is a government scholarship: two years abroad, and four years owed back to the service. The other is a foreign university's own money, with no bond and no one to call if it ends. Your {father} reads the bond page twice and asks who will be your guarantor."
  }
 },
 "r_scholarship_kid_3": {
  "strings": {
   "It is four in the morning where you are and the middle of the afternoon at home. Your mother says your father went to lie down after lunch. The funeral is seven nights. Your exams are in nine days, and your head of department has already been kind once this year.": "It is four in the morning where you are and the middle of the afternoon at home. Your {mother} says your {father} went to lie down after lunch. The funeral is seven nights. Your exams are in nine days, and your head of department has already been kind once this year.",
   "You passed. You arrived for the cremation. Your mother never mentioned it, and that was the hardest part.": "You passed. You arrived for the cremation. Your {mother} never mentioned it, and that was the hardest part.",
   "You arrived for the second night. Your mother held your arm at every ceremony.": "You arrived for the second night. Your {mother} held your arm at every ceremony."
  }
 },
 "r_scholarship_kid_5": {
  "strings": {
   "Your mother's stairs": "Your {mother}'s stairs",
   "Your mother can no longer manage the stairs in the suburban house your father paid for in instalments. Your sister has two children and a job in Chonburi. Everyone already knows whose turn it is.": "Your {mother} can no longer manage the stairs in the suburban house your {father} paid for in instalments. Your sister has two children and a job in Chonburi. Everyone already knows whose turn it is.",
   "Your sister took her for a year. Your mother called you every night to say she was fine.": "Your sister took {her} for a year. Your {mother} called you every night to say {she} was fine.",
   "Move her into your flat": "Move {her} into your flat",
   "She rearranged your kitchen in a week and slept better than she had in years. You slept worse.": "{She} rearranged your kitchen in a week and slept better than {she} had in years. You slept worse."
  }
 },
 "r_kharatchakan_1": {
  "strings": {
   "You passed the civil-service exam, and the letter posts you to a school four hours from your mother, at the end of a laterite road. A friend of your father's at the provincial office says a transfer nearer home could be arranged. Everyone knows what arranged means.": "You passed the civil-service exam, and the letter posts you to a school four hours from your {mother}, at the end of a laterite road. A friend of your {father}'s at the provincial office says a transfer nearer home could be arranged. Everyone knows what arranged means."
  }
 },
 "r_kharatchakan_2": {
  "strings": {
   "The baht has gone. Your friend from university who joined a finance company is selling his car at the market on Sunday. Your salary arrived on the twenty-fifth as it always does, and your mother says she told you so.": "The baht has gone. Your friend from university who joined a finance company is selling his car at the market on Sunday. Your salary arrived on the twenty-fifth as it always does, and your {mother} says {she} told you so."
  }
 },
 "r_kharatchakan_3": {
  "strings": {
   "Your father's bed": "Your {father}'s bed",
   "Your father is in the provincial hospital with his heart, in the government ward with the fans. The bill is already under your name, because your scheme covers your parents. Your brother, who sells cars, says he will pay for a private room.": "Your {father} is in the provincial hospital with {his} heart, in the government ward with the fans. The bill is already under your name, because your scheme covers your parents. Your brother, who sells cars, says he will pay for a private room.",
   "Keep him on your cover": "Keep {him} on your cover",
   "He complained about the fan and the food and lived nine more years. Your brother bought him a television instead.": "{He} complained about the fan and the food and lived nine more years. Your brother bought {him} a television instead."
  },
  "custom": {
   "Your father's bed": {
    "GM": "Your mother's bed"
   },
   "Your father is in the provincial hospital with his heart, in the government ward with the fans. The bill is already under your name, because your scheme covers your parents. Your brother, who sells cars, says he will pay for a private room.": {
    "GM": "Your mother is in the provincial hospital with her heart, in the government ward with the fans. The bill is already under your name, because your scheme covers your parents. Your brother, who sells cars, says he will pay for a private room."
   },
   "Keep him on your cover": {
    "GM": "Keep her on your cover"
   },
   "He complained about the fan and the food and lived nine more years. Your brother bought him a television instead.": {
    "GM": "She complained about the fan and the food and lived nine more years. Your brother bought her a television instead."
   }
  },
  "customLang": {
   "Your father's bed": {
    "GM": {
     "th": "เตียงของแม่",
     "zh-CN": "母亲的病床",
     "ja": "母のベッド",
     "ko": "어머니의 병상"
    }
   },
   "Your father is in the provincial hospital with his heart, in the government ward with the fans. The bill is already under your name, because your scheme covers your parents. Your brother, who sells cars, says he will pay for a private room.": {
    "GM": {
     "th": "แม่นอนโรงพยาบาลจังหวัดด้วยโรคหัวใจ อยู่ตึกสามัญที่มีแต่พัดลม ใบแจ้งค่ารักษาเป็นชื่อคุณอยู่แล้ว เพราะสิทธิของคุณครอบคลุมพ่อแม่ น้องชายที่ขายรถบอกว่าจะจ่ายค่าห้องพิเศษให้",
     "zh-CN": "母亲因为心脏住进了府医院，住的是公立病房，有吊扇的那种。账单已经记在你名下，因为你的医保覆盖父母。卖车的哥哥说，他来出钱换单人病房。",
     "ja": "母は心臓を患い、県立病院の、扇風機の回る一般病棟にいる。請求書はすでにあなたの名義だ。あなたの制度は親も対象になるからである。車を売っている弟は、個室の費用を出すと言う。",
     "ko": "어머니가 심장 때문에 주 병원에 있다. 선풍기가 도는 일반 병동이다. 청구서는 이미 당신 이름으로 되어 있다. 공무원 의료 제도가 부모까지 보장하기 때문이다. 자동차를 파는 남동생은 개인 병실 값을 자기가 내겠다고 한다."
    }
   },
   "Keep him on your cover": {
    "GM": {
     "th": "ให้แม่ใช้สิทธิของคุณต่อ",
     "zh-CN": "继续用你的医保",
     "ja": "自分の制度のままにする",
     "ko": "내 보장으로 계속 모신다"
    }
   },
   "He complained about the fan and the food and lived nine more years. Your brother bought him a television instead.": {
    "GM": {
     "th": "แม่บ่นเรื่องพัดลม บ่นเรื่องอาหาร และอยู่ต่อมาอีกเก้าปี น้องชายซื้อโทรทัศน์ให้แม่แทน",
     "zh-CN": "她抱怨风扇，抱怨饭菜，又活了九年。哥哥改送了她一台电视机。",
     "ja": "母は扇風機と食事に文句を言い、それから9年生きた。弟は代わりにテレビを買ってやった。",
     "ko": "어머니는 선풍기와 밥을 두고 불평했고 아홉 해를 더 살았다. 남동생은 대신 텔레비전을 사 주었다."
    }
   }
  }
 },
 "r_kharatchakan_5": {
  "custom": {
   "On your last morning the students line up with jasmine garlands, and the director gives a speech with your name spelled wrong. From next month the pension arrives on the same day the salary did, and the same card still covers your parents and your spouse.": {
    "GM": "On your last morning the students line up with jasmine garlands, and the director gives a speech with your name spelled wrong. From next month the pension arrives on the same day the salary did, and the same card still covers your mother and your spouse.",
    "GF": "On your last morning the students line up with jasmine garlands, and the director gives a speech with your name spelled wrong. From next month the pension arrives on the same day the salary did, and the same card still covers your father and your spouse."
   }
  },
  "customLang": {
   "On your last morning the students line up with jasmine garlands, and the director gives a speech with your name spelled wrong. From next month the pension arrives on the same day the salary did, and the same card still covers your parents and your spouse.": {
    "GM": {
     "th": "เช้าวันสุดท้าย นักเรียนเข้าแถวถือพวงมาลัยมะลิ ผู้อำนวยการกล่าวสุนทรพจน์ที่สะกดชื่อคุณผิด ตั้งแต่เดือนหน้า บำนาญจะเข้าวันเดียวกับที่เงินเดือนเคยเข้า บัตรใบเดิมยังคุ้มครองแม่และคู่สมรสของคุณ",
     "zh-CN": "最后一个早晨，学生们捧着茉莉花环排成一队，校长致辞，稿子上你的名字写错了。从下个月起，退休金会在以前发工资的那一天到账，那张卡照旧保着你的母亲和配偶。",
     "ja": "最後の朝、生徒たちがジャスミンの花輪を持って並び、校長はあなたの名前の綴りを間違えた挨拶を読む。来月からは、給料と同じ日に年金が届く。同じカードが、これまでどおり母と配偶者も守る。",
     "ko": "마지막 아침, 학생들이 재스민 화환을 들고 줄을 서고, 교장은 이름을 틀리게 적은 연설문을 읽는다. 다음 달부터 연금은 월급이 들어오던 날에 들어오고, 같은 카드가 여전히 어머니와 배우자를 보장한다."
    },
    "GF": {
     "th": "เช้าวันสุดท้าย นักเรียนเข้าแถวถือพวงมาลัยมะลิ ผู้อำนวยการกล่าวสุนทรพจน์ที่สะกดชื่อคุณผิด ตั้งแต่เดือนหน้า บำนาญจะเข้าวันเดียวกับที่เงินเดือนเคยเข้า บัตรใบเดิมยังคุ้มครองพ่อและคู่สมรสของคุณ",
     "zh-CN": "最后一个早晨，学生们捧着茉莉花环排成一队，校长致辞，稿子上你的名字写错了。从下个月起，退休金会在以前发工资的那一天到账，那张卡照旧保着你的父亲和配偶。",
     "ja": "最後の朝、生徒たちがジャスミンの花輪を持って並び、校長はあなたの名前の綴りを間違えた挨拶を読む。来月からは、給料と同じ日に年金が届く。同じカードが、これまでどおり父と配偶者も守る。",
     "ko": "마지막 아침, 학생들이 재스민 화환을 들고 줄을 서고, 교장은 이름을 틀리게 적은 연설문을 읽는다. 다음 달부터 연금은 월급이 들어오던 날에 들어오고, 같은 카드가 여전히 아버지와 배우자를 보장한다."
    }
   }
  }
 },
 "r_isan_daughter_1": {
  "strings": {
   "Your cousin has a bed for you in a room near a factory on the edge of Bangkok, and the line needs girls who can sit still. Your mother has packed sticky rice and dried fish in a plastic bag. Your teacher says you could finish M6.": "Your cousin has a bed for you in a room near a factory on the edge of Bangkok, and the line needs girls who can sit still. Your {mother} has packed sticky rice and dried fish in a plastic bag. Your teacher says you could finish M6."
  }
 },
 "r_isan_daughter_2": {
  "strings": {
   "Your daughter is three months old. The room is two metres by three and the shift starts at six. Your mother says to bring her home: she raised four, she can raise one more.": "Your daughter is three months old. The room is two metres by three and the shift starts at six. Your {mother} says to bring her home: {she} raised four, {she} can raise one more.",
   "Take her to your mother": "Take her to your {mother}",
   "She learned to walk in the village and called your mother Mae. You saw her at Songkran and New Year, and sent money every month.": "She learned to walk in the village and called your {mother} Mae. You saw her at Songkran and New Year, and sent money every month."
  },
  "custom": {
   "She learned to walk in the village and called your mother Mae. You saw her at Songkran and New Year, and sent money every month.": {
    "FF": "She learned to walk in the village and called your other father Pho. You saw her at Songkran and New Year, and sent money every month."
   }
  },
  "customLang": {
   "She learned to walk in the village and called your mother Mae. You saw her at Songkran and New Year, and sent money every month.": {
    "FF": {
     "th": "ลูกหัดเดินที่หมู่บ้าน และเรียกพ่ออีกคนของคุณว่าพ่อ คุณได้เจอลูกตอนสงกรานต์กับปีใหม่ และส่งเงินทุกเดือน",
     "zh-CN": "她在村里学会了走路，管你另一位父亲叫“爸爸”。你在宋干节和新年见到她，每个月寄钱。",
     "ja": "娘は村で歩くことを覚え、あなたのもう一人の父をポー（お父さん）と呼んだ。会うのはソンクラーンと正月で、金は毎月送った。",
     "ko": "아이는 마을에서 걸음마를 뗐고 당신의 다른 아버지를 아빠라고 불렀다. 송끄란과 새해에 아이를 보았고, 매달 돈을 보냈다."
    },
    "GF": {
     "th": "ลูกหัดเดินที่หมู่บ้าน และเรียกย่าของคุณว่าแม่ คุณได้เจอลูกตอนสงกรานต์กับปีใหม่ และส่งเงินทุกเดือน",
     "zh-CN": "她在村里学会了走路，管你奶奶叫“妈妈”。你在宋干节和新年见到她，每个月寄钱。",
     "ja": "娘は村で歩くことを覚え、あなたの祖母をメー（お母さん）と呼んだ。会うのはソンクラーンと正月で、金は毎月送った。",
     "ko": "아이는 마을에서 걸음마를 뗐고 당신의 할머니를 엄마라고 불렀다. 송끄란과 새해에 아이를 보았고, 매달 돈을 보냈다."
    }
   },
   "Your daughter is three months old. The room is two metres by three and the shift starts at six. Your mother says to bring her home: she raised four, she can raise one more.": {
    "GF": {
     "th": "ลูกสาวคุณอายุสามเดือน ห้องกว้างสองเมตร ยาวสามเมตร กะเริ่มหกโมง ย่าบอกให้พาเหลนกลับบ้าน เลี้ยงมาแล้วสี่คน เลี้ยงอีกคนก็ได้"
    },
    "FF": {
     "zh-CN": "女儿三个月大。房间两米宽三米长，六点开工。另一位父亲说把她带回家来：他养大了四个，再养一个也行。"
    }
   }
  }
 },
 "r_isan_daughter_4": {
  "strings": {
   "Your father's left hand": "Your {father}'s left hand",
   "Your father's left hand stopped working on a Tuesday. Your brothers are in Rayong and Korea. Your mother calls every night and does not ask.": "Your {father}'s left hand stopped working on a Tuesday. Your brothers are in Rayong and Korea. Your {mother} calls every night and does not ask.",
   "They sent money and said next year. Your mother stopped mentioning them.": "They sent money and said next year. Your {mother} stopped mentioning them.",
   "Go home and nurse him": "Go home and nurse {him}",
   "You fed him with a spoon for two years and opened a small shop on the porch. Your daughter came home from school to find you there.": "You fed {him} with a spoon for two years and opened a small shop on the porch. Your daughter came home from school to find you there."
  }
 },
 "r_win_motorsai_1": {
  "strings": {
   "The district office smells of floor polish and a thousand young men. Your father's knees have gone and your mother sells rice at the port gate. You can volunteer, draw a card from the jar, or file papers for supporting a parent, though the papers were due a month ago.": "The district office smells of floor polish and a thousand young men. Your {father}'s knees have gone and your {mother} sells rice at the port gate. You can volunteer, draw a card from the jar, or file papers for supporting a parent, though the papers were due a month ago.",
   "Red. Two years of rice and boots and a sergeant who called you by your village. Your mother counted the money you did not send.": "Red. Two years of rice and boots and a sergeant who called you by your village. Your {mother} counted the money you did not send."
  }
 },
 "r_rice_debt_1": {
  "strings": {
   "Your mother has saved for your ordination since you were born, in a tin behind the spirit shrine. Your girlfriend's father says the wedding should be after the harvest, and the harvest needs you.": "Your {mother} has saved for your ordination since you were born, in a tin behind the spirit shrine. Your girlfriend's father says the wedding should be after the harvest, and the harvest needs you.",
   "The harvest was good. Your mother kept the tin.": "The harvest was good. Your {mother} kept the tin.",
   "Your mother held the hem of your robe in the procession and cried the whole way round the hall. You learned to sit still.": "Your {mother} held the hem of your robe in the procession and cried the whole way round the hall. You learned to sit still."
  }
 },
 "r_no_buffer_1": {
  "strings": {
   "Your grandmother raised you, and she died on a Wednesday. Your mother has a room in Bangkok and a man you have met once. The headman says you can stay with a cousin and finish school, if the cousin agrees.": "Your grandmother raised you, and she died on a Wednesday. Your {mother} has a room in Bangkok and a man you have met once. The headman says you can stay with a cousin and finish school, if the cousin agrees.",
   "Go to your mother in the city": "Go to your {mother} in the city"
  },
  "custom": {
   "Your grandmother raised you, and she died on a Wednesday. Your mother has a room in Bangkok and a man you have met once. The headman says you can stay with a cousin and finish school, if the cousin agrees.": {
    "GF": "Your grandmother raised you, and she died on a Wednesday. Your father has a room in Bangkok and someone you have met once. The headman says you can stay with a cousin and finish school, if the cousin agrees."
   },
   "Go to your mother in the city": {
    "GF": "Go to your father in the city"
   }
  },
  "customLang": {
   "Your grandmother raised you, and she died on a Wednesday. Your mother has a room in Bangkok and a man you have met once. The headman says you can stay with a cousin and finish school, if the cousin agrees.": {
    "GF": {
     "th": "ยายเลี้ยงคุณมา และยายตายในวันพุธ พ่อมีห้องเช่าอยู่กรุงเทพฯ กับใครคนหนึ่งที่คุณเคยเจอครั้งเดียว ผู้ใหญ่บ้านบอกว่าคุณไปอยู่กับญาติแล้วเรียนให้จบได้ ถ้าญาติยอม",
     "zh-CN": "奶奶把你带大，她在一个星期三去世了。父亲在曼谷有一间房，还有一个你只见过一次的人。村长说你可以住到表姐家把书读完，只要表姐同意。",
     "ja": "あなたを育てたのは祖母で、祖母は水曜日に死んだ。父にはバンコクに部屋があり、あなたが一度会ったきりの人がいる。村長は、いとこが承知すれば、そこに身を寄せて学校を終えられると言う。",
     "ko": "할머니가 당신을 키웠고, 어느 수요일에 세상을 떠났다. 아버지에게는 방콕의 방 한 칸과 당신이 한 번 만난 사람이 있다. 이장은 사촌 집에 있으면서 학교를 마칠 수 있다고 한다. 사촌이 받아 준다면."
    },
    "FF": {
     "zh-CN": "奶奶把你带大，她在一个星期三去世了。另一位父亲在曼谷有一间房，还有一个你只见过一次的男人。村长说你可以住到表姐家把书读完，只要表姐同意。"
    }
   },
   "Go to your mother in the city": {
    "GF": {
     "th": "ไปหาพ่อที่กรุงเทพฯ",
     "zh-CN": "去城里找父亲",
     "ja": "都会の父のもとへ行く",
     "ko": "도시의 아버지에게 간다"
    }
   }
  }
 },
 "r_cadet_1": {
  "strings": {
   "You went home in the second term. Your father did not speak to you until Songkran.": "You went home in the second term. Your {father} did not speak to you until Songkran."
  }
 },
 "r_cadet_4": {
  "strings": {
   "You learned to read a budget and to smile at cameras. Your old platoon sent a wreath when your mother died, with every name spelled right.": "You learned to read a budget and to smile at cameras. Your old platoon sent a wreath when your {mother} died, with every name spelled right."
  },
  "customLang": {
   "You learned to read a budget and to smile at cameras. Your old platoon sent a wreath when your mother died, with every name spelled right.": {
    "FF": {
     "th": "คุณเรียนอ่านงบประมาณและเรียนยิ้มให้กล้อง หมวดเก่าของคุณส่งพวงหรีดมาเมื่อพ่ออีกคนของคุณเสีย สะกดชื่อถูกทุกคน"
    }
   }
  }
 },
 "r_tycoon_1": {
  "strings": {
   "The police cadet school has taken you, and the top of the class is sent abroad to study. Your mother borrowed for the uniform.": "The police cadet school has taken you, and the top of the class is sent abroad to study. Your {mother} borrowed for the uniform."
  }
 },
 "r_far_scholar_1": {
  "strings": {
   "You learned to draw cities before you had seen one. Your parents saw you at Songkran.": "You learned to draw cities before you had seen one. Your {parents} saw you at Songkran."
  },
  "customLang": {
   "You learned to draw cities before you had seen one. Your parents saw you at Songkran.": {
    "GM": {
     "ko": "도시를 보기도 전에 도시를 그리는 법을 배웠다. 가족은 송끄란에나 얼굴을 보았다."
    },
    "GF": {
     "ko": "도시를 보기도 전에 도시를 그리는 법을 배웠다. 가족은 송끄란에나 얼굴을 보았다."
    }
   }
  }
 },
 "r_far_scholar_3": {
  "strings": {
   "A research post wants you in Europe, a city government in Asia wants you for its data, and your mother wants you home. Each job is three years.": "A research post wants you in Europe, a city government in Asia wants you for its data, and your {mother} wants you home. Each job is three years.",
   "Go home to your mother": "Go home to your {mother}",
   "She was proud for a week and then asked when you would marry.": "{She} was proud for a week and then asked when you would marry."
  }
 },
 "r_singer_office_1": {
  "strings": {
   "A small label wants your band to record next month, the same week your university registration closes. Your mother has ironed your white shirt for the first lecture.": "A small label wants your band to record next month, the same week your university registration closes. Your {mother} has ironed your white shirt for the first lecture."
  }
 },
 "n1_car_door": {
  "strings": {
   "It was ten awkward minutes about nothing. Your mother asked if you were ill.": "It was ten awkward minutes about nothing. Your {mother} asked if you were ill."
  }
 },
 "n1_trip": {
  "strings": {
   "It was a modest trip with three changes of train. Your mother talked to strangers all the way and slept soundly in every hotel.": "It was a modest trip with three changes of train. Your {mother} talked to strangers all the way and slept soundly in every hotel."
  }
 },
 "n1_grandparent": {
  "strings": {
   "A grandparent is unwell the week you are due to leave to study in another country. Your parents say not to come back, and to keep going. A fare costs a month of food.": "A grandparent is unwell the week you are due to leave to study in another country. Your {parents} say not to come back, and to keep going. A fare costs a month of food."
  },
  "customLang": {
   "A grandparent is unwell the week you are due to leave to study in another country. Your parents say not to come back, and to keep going. A fare costs a month of food.": {
    "GM": {
     "ko": "유학을 떠나는 주에 조부모님 한 분이 앓아누웠다. 가족은 돌아오지 말고 그대로 가라고 한다. 차비는 한 달 먹을 돈이다."
    },
    "GF": {
     "ko": "유학을 떠나는 주에 조부모님 한 분이 앓아누웠다. 가족은 돌아오지 말고 그대로 가라고 한다. 차비는 한 달 먹을 돈이다."
    }
   }
  }
 },
 "n2_ten_days": {
  "strings": {
   "Your father died on a Monday. The monks come at dusk, the guests from three provinces come after lunch, and someone has to find the photographs for the booklet. Nobody has had time to sit down since.": "Your {father} died on a Monday. The monks come at dusk, the guests from three provinces come after lunch, and someone has to find the photographs for the booklet. Nobody has had time to sit down since."
  }
 },
 "n2_trip_plan": {
  "gate": [
   "GM"
  ],
  "strings": {
   "Your mother's husband retires in March. You have been saving for years to take him to the places he only knows from stamps. The tickets are in a drawer, unbooked.": "Your {mother}'s husband retires in March. You have been saving for years to take {him} to the places {he} only knows from stamps. The tickets are in a drawer, unbooked.",
   "Wait until he has actually retired": "Wait until {he} has actually retired",
   "He retired on a Friday. The plan stayed in the drawer longer than the spring did.": "{He} retired on a Friday. The plan stayed in the drawer longer than the spring did.",
   "Book the first leg now, while he still works": "Book the first leg now, while {he} still works",
   "He packed a week early and laughed at himself for it. You flew in April.": "{He} packed a week early and laughed at {himself} for it. You flew in April.",
   "Take him somewhere close, this month": "Take {him} somewhere close, this month",
   "You went three hours by bus to a river he had never seen. He talked the whole way back.": "You went three hours by bus to a river {he} had never seen. {He} talked the whole way back."
  },
  "custom": {
   "Your mother's husband retires in March. You have been saving for years to take him to the places he only knows from stamps. The tickets are in a drawer, unbooked.": {
    "GF": "Your father retires in March. You have been saving for years to take him to the places he only knows from stamps. The tickets are in a drawer, unbooked.",
    "FF": "Your father retires in March. You have been saving for years to take him to the places he only knows from stamps. The tickets are in a drawer, unbooked.",
    "MM": "Your other mother retires in March. You have been saving for years to take her to the places she only knows from stamps. The tickets are in a drawer, unbooked."
   }
  },
  "customLang": {
   "Your mother's husband retires in March. You have been saving for years to take him to the places he only knows from stamps. The tickets are in a drawer, unbooked.": {
    "GF": {
     "th": "พ่อของคุณจะเกษียณเดือนมีนาคม คุณเก็บเงินมาหลายปีเพื่อพาเขาไปยังที่ที่เขารู้จักแค่จากแสตมป์ ตั๋วอยู่ในลิ้นชัก ยังไม่ได้จอง",
     "zh-CN": "你父亲三月退休。你攒了多年的钱,要带他去那些他只在邮票上见过的地方。机票放在抽屉里,还没订。",
     "ja": "父は三月に退職する。切手でしか知らない場所へ連れていくために、何年も貯金してきた。チケットは引き出しの中で、まだ予約していない。",
     "ko": "아버지가 삼월에 퇴직한다. 그가 우표로만 아는 곳들에 데려가려고 몇 해째 돈을 모아 왔다. 표는 서랍 속에 있고, 아직 예약하지 않았다."
    },
    "FF": {
     "th": "พ่อของคุณจะเกษียณเดือนมีนาคม คุณเก็บเงินมาหลายปีเพื่อพาเขาไปยังที่ที่เขารู้จักแค่จากแสตมป์ ตั๋วอยู่ในลิ้นชัก ยังไม่ได้จอง",
     "zh-CN": "你父亲三月退休。你攒了多年的钱,要带他去那些他只在邮票上见过的地方。机票放在抽屉里,还没订。",
     "ja": "父は三月に退職する。切手でしか知らない場所へ連れていくために、何年も貯金してきた。チケットは引き出しの中で、まだ予約していない。",
     "ko": "아버지가 삼월에 퇴직한다. 그가 우표로만 아는 곳들에 데려가려고 몇 해째 돈을 모아 왔다. 표는 서랍 속에 있고, 아직 예약하지 않았다."
    },
    "MM": {
     "th": "แม่อีกคนของคุณจะเกษียณเดือนมีนาคม คุณเก็บเงินมาหลายปีเพื่อพาเขาไปยังที่ที่เขารู้จักแค่จากแสตมป์ ตั๋วอยู่ในลิ้นชัก ยังไม่ได้จอง",
     "zh-CN": "你另一位母亲三月退休。你攒了多年的钱,要带她去那些她只在邮票上见过的地方。机票放在抽屉里,还没订。",
     "ja": "もう一人の母は三月に退職する。切手でしか知らない場所へ連れていくために、何年も貯金してきた。チケットは引き出しの中で、まだ予約していない。",
     "ko": "다른 어머니가 삼월에 퇴직한다. 그녀가 우표로만 아는 곳들에 데려가려고 몇 해째 돈을 모아 왔다. 표는 서랍 속에 있고, 아직 예약하지 않았다."
    }
   }
  }
 },
 "n2_twentyseven": {
  "strings": {
   "Your aunts have been counting. The list of people you could marry has grown to four, none of whom you have a view on. Your mother has not said anything, which is how you know it matters.": "Your aunts have been counting. The list of people you could marry has grown to four, none of whom you have a view on. Your {mother} has not said anything, which is how you know it matters.",
   "Ask her what she is actually afraid of": "Ask {her} what {she} is actually afraid of",
   "Three coffees, one second coffee, nothing. Your mother was kind about it.": "Three coffees, one second coffee, nothing. Your {mother} was kind about it."
  }
 },
 "n2_how_know": {
  "strings": {
   "A classmate told another classmate who told you that a third boy copied in the exam. You repeat it at dinner, pleased to be the one who knows. Your father puts down his spoon and asks whether you saw it.": "A classmate told another classmate who told you that a third boy copied in the exam. You repeat it at dinner, pleased to be the one who knows. Your {father} puts down {his} spoon and asks whether you saw it.",
   "He said that in this house you would say what you saw. It was the only time that year he was not gentle.": "{He} said that in this house you would say what you saw. It was the only time that year {he} was not gentle.",
   "He asked who everybody was. You could name nobody.": "{He} asked who everybody was. You could name nobody."
  }
 },
 "n2_ribbon": {
  "strings": {
   "A suitcase with its own tracker costs five hundred dollars and needs two sets of batteries. Your mother suggests tying a coloured ribbon on the handle of the one you have. You have never lost a bag, and she knows that.": "A suitcase with its own tracker costs five hundred dollars and needs two sets of batteries. Your {mother} suggests tying a coloured ribbon on the handle of the one you have. You have never lost a bag, and {she} knows that."
  }
 },
 "n2_tenure": {
  "strings": {
   "You are offered a permanent contract. You are the first in your family with one, and your colleagues have told you what it does to a person. Your mother wants you to sign today.": "You are offered a permanent contract. You are the first in your family with one, and your colleagues have told you what it does to a person. Your {mother} wants you to sign today."
  }
 },
 "n2_lost_pen": {
  "strings": {
   "The pen from your father": "The pen from your {father}",
   "He gave you a fountain pen when you graduated, and you have used it for everything important since. On the last day of a trip you reach into your bag and it is not there. The taxi has gone.": "{He} gave you a fountain pen when you graduated, and you have used it for everything important since. On the last day of a trip you reach into your bag and it is not there. The taxi has gone."
  }
 },
 "n3_bite": {
  "strings": {
   "The pain did not read the sentence. You were in the emergency room by seven with a face your mother recognised.": "The pain did not read the sentence. You were in the emergency room by seven with a face your {mother} recognised."
  },
  "customLang": {
   "The pain did not read the sentence. You were in the emergency room by seven with a face your mother recognised.": {
    "FF": {
     "th": "ความเจ็บไม่ได้อ่านประโยคนั้น เจ็ดโมงคุณก็อยู่ห้องฉุกเฉิน ด้วยสีหน้าที่พ่ออีกคนของคุณจำได้"
    }
   }
  }
 },
 "n3_message": {
  "strings": {
   "You arrived after the funeral rites began. Your mother held your sleeve for the whole of the second day.": "You arrived after the funeral rites began. Your {mother} held your sleeve for the whole of the second day."
  }
 },
 "i_ptt": {
  "strings": {
   "The state oil company is selling shares to the public at thirty-five baht. Your brother-in-law says the government will never let it fail. Your mother says a bank has a roof.": "The state oil company is selling shares to the public at thirty-five baht. Your brother-in-law says the government will never let it fail. Your {mother} says a bank has a roof."
  }
 },
 "i_coin": {
  "strings": {
   "He looked at you the way you once looked at your father.": "He looked at you the way you once looked at your {father}."
  }
 },
 "g_will": {
  "custom": {
   "Your parents never spent anything and it turns out they owned a piece of land. They left no will anyone can agree on. Your brother has already sold the car. Your sister has a lawyer. Everyone at the table was raised by the same two frugal people.": {
    "GM": "Your mother and grandmother never spent anything and it turns out they owned a piece of land. They left no will anyone can agree on. Your brother has already sold the car. Your sister has a lawyer. Everyone at the table was raised by the same two frugal people.",
    "GF": "Your father and grandmother never spent anything and it turns out they owned a piece of land. They left no will anyone can agree on. Your brother has already sold the car. Your sister has a lawyer. Everyone at the table was raised by the same two frugal people."
   }
  },
  "customLang": {
   "Your parents never spent anything and it turns out they owned a piece of land. They left no will anyone can agree on. Your brother has already sold the car. Your sister has a lawyer. Everyone at the table was raised by the same two frugal people.": {
    "GM": {
     "th": "แม่กับยายไม่เคยใช้จ่ายอะไร แล้วปรากฏว่ามีที่ดินแปลงหนึ่ง พินัยกรรมก็ไม่มีฉบับที่ทุกคนยอมรับ พี่ชายขายรถไปแล้ว พี่สาวมีทนาย ทุกคนที่โต๊ะนี้ถูกเลี้ยงมาโดยคนประหยัดสองคนเดียวกัน",
     "zh-CN": "你母亲和外婆一辈子不花钱，结果名下有一块地。没有一份大家都认的遗嘱。哥哥已经把车卖了。姐姐请了律师。桌上的每个人，都是同样两个节俭的人带大的。",
     "ja": "母と祖母は何にも金を使わなかったが、土地を一区画持っていた。誰もが認める遺言はない。兄はもう車を売った。姉には弁護士がいる。この食卓の全員が、同じ倹約家の二人に育てられた。",
     "ko": "어머니와 할머니는 아무것도 쓰지 않았는데 알고 보니 땅이 한 필지 있었다. 모두가 인정할 유언은 없다. 형은 이미 차를 팔았다. 누나는 변호사를 샀다. 이 식탁의 모두가 똑같이 검소한 두 사람 손에 컸다."
    },
    "GF": {
     "th": "พ่อกับย่าไม่เคยใช้จ่ายอะไร แล้วปรากฏว่ามีที่ดินแปลงหนึ่ง พินัยกรรมก็ไม่มีฉบับที่ทุกคนยอมรับ พี่ชายขายรถไปแล้ว พี่สาวมีทนาย ทุกคนที่โต๊ะนี้ถูกเลี้ยงมาโดยคนประหยัดสองคนเดียวกัน",
     "zh-CN": "你父亲和奶奶一辈子不花钱，结果名下有一块地。没有一份大家都认的遗嘱。哥哥已经把车卖了。姐姐请了律师。桌上的每个人，都是同样两个节俭的人带大的。",
     "ja": "父と祖母は何にも金を使わなかったが、土地を一区画持っていた。誰もが認める遺言はない。兄はもう車を売った。姉には弁護士がいる。この食卓の全員が、同じ倹約家の二人に育てられた。",
     "ko": "아버지와 할머니는 아무것도 쓰지 않았는데 알고 보니 땅이 한 필지 있었다. 모두가 인정할 유언은 없다. 형은 이미 차를 팔았다. 누나는 변호사를 샀다. 이 식탁의 모두가 똑같이 검소한 두 사람 손에 컸다."
    }
   }
  }
 },
 "g_funeral": {
  "strings": {
   "Seven nights for your father": "Seven nights for your {father}",
   "Your father has died and the temple is asking how many nights. Everyone he knew will come and count the flowers. What you have in the account will not do it.": "Your {father} has died and the temple is asking how many nights. Everyone {he} knew will come and count the flowers. What you have in the account will not do it."
  },
  "custom": {
   "They understood. His sister did not, and she has a long memory.": {
    "GM": "They understood. Her sister did not, and she has a long memory.",
    "MM": "They understood. Her sister did not, and she has a long memory."
   }
  },
  "customLang": {
   "They understood. His sister did not, and she has a long memory.": {
    "GM": {
     "th": "พระเข้าใจ แต่น้องสาวของยายไม่ และเธอจำแม่น",
     "zh-CN": "僧人理解。她妹妹不理解，而且她记性很好。",
     "ja": "僧はわかってくれた。祖母の妹はわからなかった。そして記憶力がいい。",
     "ko": "스님들은 이해했다. 이모할머니는 아니었고, 기억력이 좋다."
    },
    "MM": {
     "th": "พระเข้าใจ แต่น้องสาวของแม่อีกคนไม่ และเธอจำแม่น",
     "zh-CN": "僧人理解。她妹妹不理解，而且她记性很好。",
     "ja": "僧はわかってくれた。もう一人の母の妹はわからなかった。そして記憶力がいい。",
     "ko": "스님들은 이해했다. 이모는 아니었고, 기억력이 좋다."
    }
   }
  }
 },
 "g_belt": {
  "gate": [
   "FF",
   "GM",
   "MM"
  ],
  "strings": {
   "He came home from the docks with nothing left in him. There are more of you than there is rice. The belt is on the nail by the door, and tonight he has looked at it twice.": "{He} came home from the docks with nothing left in {him}. There are more of you than there is rice. The belt is on the nail by the door, and tonight {he} has looked at it twice.",
   "Stand between him and your mother": "Stand between {him} and your {mother}"
  },
  "custom": {
   "Stand between him and your mother": {
    "FF": "Stand between him and your other father"
   }
  }
 },
 "s_lost": {
  "gate": [
   "FF"
  ],
  "strings": {
   "Your mother lights incense on a day nobody explains. There was a child before you, born too early to be given a name at home. Your parents say you are living for two.": "Your {mother} lights incense on a day nobody explains. There was a child before you, born too early to be given a name at home. Your {parents} say you are living for two.",
   "They told you everything, at the kitchen table, and then did not stop. You had never heard your father say her name.": "They told you everything, at the kitchen table, and then did not stop. You had never heard your {father} say her name."
  },
  "customLang": {
   "Your mother lights incense on a day nobody explains. There was a child before you, born too early to be given a name at home. Your parents say you are living for two.": {
    "GM": {
     "ko": "어머니가 아무도 설명하지 않는 날에 향을 피운다. 당신 앞에 아이가 하나 있었는데, 너무 일찍 태어나 집에서 이름도 지어 주지 못했다. 가족은 당신이 둘을 대신해 살고 있다고 말한다."
    },
    "GF": {
     "ko": "할머니가 아무도 설명하지 않는 날에 향을 피운다. 당신 앞에 아이가 하나 있었는데, 너무 일찍 태어나 집에서 이름도 지어 주지 못했다. 가족은 당신이 둘을 대신해 살고 있다고 말한다."
    }
   },
   "They told you everything, at the kitchen table, and then did not stop. You had never heard your father say her name.": {
    "GM": {
     "ko": "가족은 부엌 식탁에서 모든 것을 이야기했고, 멈추지 않았다. 할머니가 그 아이의 이름을 말하는 것을 당신은 처음 들었다."
    }
   }
  }
 },
 "s_eldest": {
  "strings": {
   "The youngest finished college and paid for your mother’s hospital bed without being asked.": "The youngest finished college and paid for your {mother}’s hospital bed without being asked."
  }
 },
 "s_youngest": {
  "strings": {
   "Everyone else has already left, and the house has been waiting for someone to stay. Your mother has started saying she is not lonely.": "Everyone else has already left, and the house has been waiting for someone to stay. Your {mother} has started saying {she} is not lonely.",
   "You went. She packed rice for two days and called on Sundays, and said she was not lonely.": "You went. {She} packed rice for two days and called on Sundays, and said {she} was not lonely.",
   "You stayed. The days were slow and exactly the length of a whole afternoon with her.": "You stayed. The days were slow and exactly the length of a whole afternoon with {her}."
  }
 },
 "g_eldest": {
  "gate": [
   "GM",
   "GF",
   "MM",
   "FF"
  ],
  "strings": {
   "Your father breaks stone for a living. He has taken another wife, as he may, and there are eleven of you now. The teacher says a scholarship to Yala could be yours. Your mother has not said anything, and has started teaching you how to manage the small ones.": "Your {father} breaks stone for a living. {He} has taken another wife, as {he} may, and there are eleven of you now. The teacher says a scholarship to Yala could be yours. Your {mother} has not said anything, and has started teaching you how to manage the small ones.",
   "You went on the morning bus. Your mother packed rice for two days and did not come to the road.": "You went on the morning bus. Your {mother} packed rice for two days and did not come to the road."
  }
 },
 "g_half": {
  "strings": {
   "A good chair, from a man who cried a little when you paid him. A trip with your mother. He bought a better lathe.": "A good chair, from a man who cried a little when you paid him. A trip with your {mother}. He bought a better lathe."
  }
 },
 "pivot:child-roof": {
  "strings": {
   "Your mother is at the stall before dawn. The school fee is due on Friday.": "Your {mother} is at the stall before dawn. The school fee is due on Friday.",
   "Work the stall with your mother after school": "Work the stall with your {mother} after school",
   "The roof waits another year. Your mother works later.": "The roof waits another year. Your {mother} works later."
  }
 },
 "pivot:stall-paper": {
  "strings": {
   "Your mother asks you to put your name on the stall’s paperwork so it can survive this year.": "Your {mother} asks you to put your name on the stall’s paperwork so it can survive this year.",
   "The stall is hers and your grandmother’s. After your name, it is half yours.": "The stall is {hers} and your grandmother’s. After your name, it is half yours.",
   "Your mother carries the year alone.": "Your {mother} carries the year alone."
  },
  "custom": {
   "The stall is hers and your grandmother’s. After your name, it is half yours.": {
    "GF": "The stall is your grandmother’s. After your name, it is half yours."
   }
  },
  "customLang": {
   "The stall is hers and your grandmother’s. After your name, it is half yours.": {
    "GF": {
     "th": "แผงเป็นของย่า พอใส่ชื่อคุณแล้ว ครึ่งหนึ่งก็เป็นของคุณ",
     "zh-CN": "摊子是奶奶的。签上你的名字后，有一半是你的。",
     "ja": "屋台は祖母のものだ。名前を入れれば、半分はあなたのものになる。",
     "ko": "노점은 할머니의 것이다. 이름을 올리면 절반은 당신 것이 된다."
    },
    "FF": {
     "zh-CN": "摊子是他和奶奶的。签上你的名字后，有一半是你的。"
    }
   }
  }
 },
 "pivot:partner-choice": {
  "strings": {
   "Your mother has already started talking to the first family.": "Your {mother} has already started talking to the first family.",
   "Your mother is disappointed, and says so for years.": "Your {mother} is disappointed, and says so for years."
  }
 },
 "pivot:flood-repair": {
  "strings": {
   "The house is your mother’s and your father’s. It is also where you sleep.": "The house is your {mother}’s and your {father}’s. It is also where you sleep."
  },
  "customLang": {
   "The house is your mother’s and your father’s. It is also where you sleep.": {
    "MM": {
     "th": "บ้านเป็นของแม่กับแม่อีกคน แต่ก็เป็นที่ที่คุณนอนด้วย",
     "zh-CN": "房子是母亲和另一位母亲的。也是你睡觉的地方。"
    },
    "FF": {
     "th": "บ้านเป็นของพ่ออีกคนกับพ่อ แต่ก็เป็นที่ที่คุณนอนด้วย",
     "zh-CN": "房子是另一位父亲和父亲的。也是你睡觉的地方。"
    },
    "GM": {
     "th": "บ้านเป็นของแม่กับยาย แต่ก็เป็นที่ที่คุณนอนด้วย",
     "zh-CN": "房子是母亲和外婆的。也是你睡觉的地方。"
    },
    "GF": {
     "th": "บ้านเป็นของย่ากับพ่อ แต่ก็เป็นที่ที่คุณนอนด้วย",
     "zh-CN": "房子是奶奶和父亲的。也是你睡觉的地方。"
    }
   }
  }
 },
 "pivot:flood-move": {
  "strings": {
   "Your father’s cousin has land in the provinces and a house with space. Staying means rebuilding in the same lane.": "Your {father}’s cousin has land in the provinces and a house with space. Staying means rebuilding in the same lane.",
   "Your mother leaves the stall and the neighbourhood.": "Your {mother} leaves the stall and the neighbourhood."
  }
 },
 "pivot:parent-ill": {
  "strings": {
   "Your mother is ill and the family needs someone home for the months it will take.": "Your {mother} is ill and the family needs someone home for the months it will take.",
   "You go home and care for her": "You go home and care for {her}",
   "You went home to care for your mother.": "You went home to care for your {mother}.",
   "Care is bought, not given. She notices.": "Care is bought, not given. {She} notices."
  }
 },
 "pivot:buy-house": {
  "strings": {
   "Buy it with your mother": "Buy it with your {mother}",
   "You bought the house together with your mother.": "You bought the house together with your {mother}."
  }
 },
 "pivot:father-tools": {
  "strings": {
   "Your father is gone. His tools, his debts and his wish that you keep the trade are yours to carry.": "Your {father} is gone. His tools, {his} debts and {his} wish that you keep the trade are yours to carry.",
   "His wish was not a request, and he was not a man who asked.": "His wish was not a request, and {he} was not a man who asked.",
   "You took your father’s tools and kept the trade.": "You took your {father}’s tools and kept the trade.",
   "You sold your father’s tools and cleared the debts.": "You sold your {father}’s tools and cleared the debts."
  },
  "custom": {
   "Your father is gone. His tools, his debts and his wish that you keep the trade are yours to carry.": {
    "GM": "Your grandmother is gone. Her tools, her debts and her wish that you keep the trade are yours to carry.",
    "MM": "Your other mother is gone. Her tools, her debts and her wish that you keep the trade are yours to carry."
   },
   "His wish was not a request, and he was not a man who asked.": {
    "GM": "Her wish was not a request, and she was not a woman who asked.",
    "MM": "Her wish was not a request, and she was not a woman who asked."
   }
  },
  "customLang": {
   "Your father is gone. His tools, his debts and his wish that you keep the trade are yours to carry.": {
    "GM": {
     "th": "ยายจากไปแล้ว เครื่องมือ หนี้สิน และความปรารถนาให้สืบทอดอาชีพ ตกเป็นภาระของคุณ",
     "zh-CN": "外婆走了。她的工具、她的债，还有她希望你把手艺传下去的心愿，都要你来扛。",
     "ja": "祖母が逝った。道具も、借金も、家業を継いでほしいという願いも、あなたが背負う。",
     "ko": "할머니가 떠났다. 그녀의 연장, 빚, 그리고 업을 이어 달라던 바람이 당신 몫으로 남았다."
    },
    "MM": {
     "th": "แม่อีกคนจากไปแล้ว เครื่องมือ หนี้สิน และความปรารถนาให้สืบทอดอาชีพ ตกเป็นภาระของคุณ",
     "zh-CN": "另一位母亲走了。她的工具、她的债，还有她希望你把手艺传下去的心愿，都要你来扛。",
     "ja": "もう一人の母が逝った。道具も、借金も、家業を継いでほしいという願いも、あなたが背負う。",
     "ko": "다른 어머니가 떠났다. 그녀의 연장, 빚, 그리고 업을 이어 달라던 바람이 당신 몫으로 남았다."
    }
   },
   "His wish was not a request, and he was not a man who asked.": {
    "GM": {
     "th": "ความปรารถนานั้นไม่ใช่คำขอ และยายก็ไม่ใช่คนที่ขออะไรใคร",
     "zh-CN": "她的心愿不是请求，她也从来不是开口求人的人。",
     "ja": "その願いは頼みではなかった。祖母は頼む人ではなかった。",
     "ko": "그 바람은 부탁이 아니었고, 그녀는 부탁하는 사람이 아니었다."
    },
    "MM": {
     "th": "ความปรารถนานั้นไม่ใช่คำขอ และแม่อีกคนก็ไม่ใช่คนที่ขออะไรใคร",
     "zh-CN": "她的心愿不是请求，她也从来不是开口求人的人。",
     "ja": "その願いは頼みではなかった。もう一人の母は頼む人ではなかった。",
     "ko": "그 바람은 부탁이 아니었고, 그녀는 부탁하는 사람이 아니었다."
    }
   }
  }
 },
 "pivot:stall-takeover": {
  "strings": {
   "Your mother asks you to take over the stall. She is tired and the stall is hers to give.": "Your {mother} asks you to take over the stall. {She} is tired and the stall is {hers} to give.",
   "You took over the stall from your mother.": "You took over the stall from your {mother}.",
   "Your mother runs it alone for longer.": "Your {mother} runs it alone for longer."
  }
 },
 "pivot:empty-house": {
  "strings": {
   "The house is empty now. Your mother’s things are still in the rooms.": "The house is empty now. Your {mother}’s things are still in the rooms.",
   "You sold the family house after your mother died.": "You sold the family house after your {mother} died."
  },
  "custom": {
   "Her things go to strangers, and the money goes to your children.": {
    "FF": "His things go to strangers, and the money goes to your children."
   }
  },
  "customLang": {
   "Her things go to strangers, and the money goes to your children.": {
    "FF": {
     "th": "ข้าวของของพ่ออีกคนไปอยู่กับคนแปลกหน้า เงินไปถึงลูกๆ ของคุณ",
     "zh-CN": "他的东西给了陌生人，钱给了你的孩子。",
     "ja": "もう一人の父の物は見知らぬ人へ、金は子どもたちへ。",
     "ko": "다른 아버지의 물건은 낯선 이들에게, 돈은 자식들에게 간다."
    }
   }
  }
 },
 "pivot:village-buffalo": {
  "strings": {
   "One child has to stay home to mind the buffalo, and you are the one old enough. The teacher walks out to the house to ask your parents not to choose you.": "One child has to stay home to mind the buffalo, and you are the one old enough. The teacher walks out to the house to ask your {parents} not to choose you.",
   "Your parents have not said no to the teacher, and they have not said yes.": "Your {parents} have not said no to the teacher, and they have not said yes."
  }
 },
 "pivot:girl-school": {
  "strings": {
   "There is money for one child to go on to secondary school, and your parents have decided it is your brother. He is not the one with the marks.": "There is money for one child to go on to secondary school, and your {parents} have decided it is your brother. He is not the one with the marks.",
   "Your parents will not forget being told in their own house.": "Your {parents} will not forget being told in their own house.",
   "The teacher came. You went on to the secondary school, and your parents paid without once looking at your report.": "The teacher came. You went on to the secondary school, and your {parents} paid without once looking at your report."
  }
 },
 "pivot:go-abroad": {
  "custom": {
   "They are short of trained people in America and they have written to you. The visa is real. Your parents are getting older.": {
    "GM": "They are short of trained people in America and they have written to you. The visa is real. Your mother and grandmother are getting older.",
    "GF": "They are short of trained people in America and they have written to you. The visa is real. Your father and grandmother are getting older."
   }
  },
  "customLang": {
   "They are short of trained people in America and they have written to you. The visa is real. Your parents are getting older.": {
    "GM": {
     "th": "อเมริกาขาดคนมีวิชา เขาเขียนจดหมายมาหาคุณ วีซ่าของจริง แม่กับยายก็แก่ลงทุกปี",
     "zh-CN": "美国缺受过训练的人，他们写信给你了。签证是真的。你的母亲和外婆一年比一年老。",
     "ja": "アメリカは訓練を受けた人を求めていて、あなたに手紙が来た。ビザは本物だ。母と祖母は年を取っていく。",
     "ko": "미국은 훈련받은 사람이 부족해 당신에게 편지를 보냈다. 비자는 진짜다. 어머니와 할머니는 나이 들어 간다."
    },
    "GF": {
     "th": "อเมริกาขาดคนมีวิชา เขาเขียนจดหมายมาหาคุณ วีซ่าของจริง พ่อกับย่าก็แก่ลงทุกปี",
     "zh-CN": "美国缺受过训练的人，他们写信给你了。签证是真的。你的父亲和奶奶一年比一年老。",
     "ja": "アメリカは訓練を受けた人を求めていて、あなたに手紙が来た。ビザは本物だ。父と祖母は年を取っていく。",
     "ko": "미국은 훈련받은 사람이 부족해 당신에게 편지를 보냈다. 비자는 진짜다. 아버지와 할머니는 나이 들어 간다."
    }
   }
  }
 },
 "child:6:shoe_hide": {
  "strings": {
   "Tell your mother": "Tell your {mother}",
   "She did not say anything. She sewed it that night, under the lamp.": "{She} did not say anything. {She} sewed it that night, under the lamp."
  },
  "custom": {
   "She did not say anything. She sewed it that night, under the lamp.": {
    "GF": "He did not say anything. He sewed it that night, under the lamp."
   }
  },
  "customLang": {
   "She did not say anything. She sewed it that night, under the lamp.": {
    "GF": {
     "th": "พ่อไม่พูดอะไร คืนนั้นพ่อเย็บมันใต้แสงโคมไฟ",
     "zh-CN": "他什么也没说。那天夜里，他在灯下把它缝好了。",
     "ja": "父は何も言わなかった。その夜、ランプの下でそれを縫った。",
     "ko": "아버지는 아무 말도 하지 않았다. 그날 밤 등불 아래에서 그것을 꿰맸다."
    }
   }
  }
 },
 "child:8:gran_answer": {
  "strings": {
   "Tell your mother": "Tell your {mother}",
   "She went to the back of the house for a while.": "{She} went to the back of the house for a while."
  },
  "custom": {
   "Tell your mother": {
    "GF": "Tell your father"
   },
   "She went to the back of the house for a while.": {
    "GF": "He went to the back of the house for a while."
   }
  },
  "customLang": {
   "Tell your mother": {
    "GF": {
     "th": "บอกพ่อ",
     "zh-CN": "告诉你爸爸",
     "ja": "父に話す",
     "ko": "아버지에게 말한다"
    }
   },
   "She went to the back of the house for a while.": {
    "GF": {
     "th": "พ่อเดินไปหลังบ้านอยู่พักหนึ่ง",
     "zh-CN": "他去了屋子后面，待了一会儿。",
     "ja": "父はしばらく家の裏へ行っていた。",
     "ko": "아버지는 한동안 집 뒤편으로 가 있었다."
    },
    "FF": {
     "th": "พ่ออีกคนเดินไปหลังบ้านอยู่พักหนึ่ง",
     "ja": "もう一人の父はしばらく家の裏へ行っていた。",
     "ko": "다른 아버지는 한동안 집 뒤편으로 가 있었다."
    }
   }
  }
 },
 "child:8:ball_stay": {
  "strings": {
   "He knew your father. It took two days.": "He knew your {father}. It took two days."
  }
 },
 "child:9:radio_open": {
  "strings": {
   "Your father has brought a radio home and says only he may touch it. It is alone in the room, and you know where the screws are.": "Your {father} has brought a radio home and says only {he} may touch it. It is alone in the room, and you know where the screws are.",
   "You put it back with one screw left over. You have never told him.": "You put it back with one screw left over. You have never told {him}.",
   "Ask him how it works": "Ask {him} how it works",
   "He talked for an hour. It was the longest he ever talked to you.": "{He} talked for an hour. It was the longest {he} ever talked to you."
  }
 },
 "misc": {
  "strings": {
   "Your mother’s world becomes yours.": "Your {mother}’s world becomes yours.",
   "Brass amulet from your father": "Brass amulet from your {father}",
   "Prayer beads from your father": "Prayer beads from your {father}",
   "Your father needs treatment for tuberculosis. Care, travel and missed work now belong to the family budget.": "Your {father} needs treatment for tuberculosis. Care, travel and missed work now belong to the family budget.",
   "You and two friends swore you would never be like your parents.": "You and two friends swore you would never be like your {parents}.",
   "Your parents find jobs; you find a new lane to play in.": "Your {parents} find jobs; you find a new lane to play in."
  },
  "custom": {
   "Your parents keep working in the city. You grow up with your grandparents, among their neighbours, fields and routines.": {
    "GM": "Your mother keeps working in the city. You grow up with your grandparents, among their neighbours, fields and routines.",
    "GF": "Your father keeps working in the city. You grow up with your grandparents, among their neighbours, fields and routines."
   },
   "Back with your parents.": {
    "GM": "Back with your mother.",
    "GF": "Back with your father."
   },
   "Your father dies. Familiar places carry different memories.": {
    "FF": "Your other father dies. Familiar places carry different memories."
   },
   "Your mother dies. The family has to find a different rhythm.": {
    "MM": "Your other mother dies. The family has to find a different rhythm."
   }
  },
  "customLang": {
   "Your parents keep working in the city. You grow up with your grandparents, among their neighbours, fields and routines.": {
    "GM": {
     "th": "แม่ยังคงทำงานในเมือง คุณเติบโตกับปู่ย่าตายาย ท่ามกลางเพื่อนบ้าน ทุ่งนา และกิจวัตรของท่าน",
     "zh-CN": "母亲继续在城里工作。你在祖父母身边长大，周围是他们的邻居、田地和日常。",
     "ja": "母は都会で働き続ける。あなたは祖父母のもとで、近所の人や田畑、その暮らしのリズムの中で育つ。",
     "ko": "어머니는 도시에서 계속 일한다. 당신은 조부모의 이웃과 논밭, 일상 속에서 자란다."
    },
    "GF": {
     "th": "พ่อยังคงทำงานในเมือง คุณเติบโตกับปู่ย่าตายาย ท่ามกลางเพื่อนบ้าน ทุ่งนา และกิจวัตรของท่าน",
     "zh-CN": "父亲继续在城里工作。你在祖父母身边长大，周围是他们的邻居、田地和日常。",
     "ja": "父は都会で働き続ける。あなたは祖父母のもとで、近所の人や田畑、その暮らしのリズムの中で育つ。",
     "ko": "아버지는 도시에서 계속 일한다. 당신은 조부모의 이웃과 논밭, 일상 속에서 자란다."
    }
   },
   "Back with your parents.": {
    "GM": {
     "th": "กลับมาอยู่กับแม่",
     "zh-CN": "回到母亲身边",
     "ja": "母のもとへ戻る",
     "ko": "어머니 곁으로"
    },
    "GF": {
     "th": "กลับมาอยู่กับพ่อ",
     "zh-CN": "回到父亲身边",
     "ja": "父のもとへ戻る",
     "ko": "아버지 곁으로"
    }
   },
   "Your father dies. Familiar places carry different memories.": {
    "FF": {
     "th": "พ่ออีกคนจากไป สถานที่คุ้นเคยมีความทรงจำเปลี่ยนไป",
     "zh-CN": "另一位父亲离世，熟悉的地方承载了不同的回忆。",
     "ja": "もう一人の父を亡くし、見慣れた場所にも違う記憶が重なります。",
     "ko": "다른 아버지가 세상을 떠났습니다. 익숙한 장소의 기억도 달라집니다."
    }
   },
   "Your mother dies. The family has to find a different rhythm.": {
    "MM": {
     "th": "แม่อีกคนจากไป ครอบครัวต้องปรับชีวิตใหม่",
     "zh-CN": "另一位母亲离世，家人需要重新适应生活。",
     "ja": "もう一人の母を亡くし、家族は新しい暮らし方を探します。",
     "ko": "다른 어머니가 세상을 떠났습니다. 가족은 새로운 일상을 찾아야 합니다."
    }
   }
  }
 }
};
