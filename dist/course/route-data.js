// Twelve lives a person can fall into, written from real Thai trajectories. Generated from research; no living person is a character.
export const ROUTE_DATA=[{"route":"scholar","fit":{"classes":["low_class","working_class","middle_class"],"sex":null,"years":[1949,1949]},"scenes":[{"id":"r_scholar_1","stage":1,"min":20,"max":20,"category":"work","title":"First on the list","prompt":"Your father guts fish at Talat Noi, and your name is first on the list outside the ministry. A government scholarship: economics in London, then twice those years owed back to the civil service. He asks you to read him the part about the money.","options":[{"id":"go","label":"Sign the bond and go to London","outcome":"You left Don Mueang in a coat borrowed from a teacher. The first winter you wore it indoors.","wellbeing":-2,"skills":{"iq":3,"drive":1},"flag":"r_scholar_1"},{"id":"stall","label":"Stay and learn the stall","outcome":"The family ate better that year. The list came down in a month, and the second name on it went to London.","cash":9000,"health":-1,"wellbeing":2,"skills":{"craft":1}}],"years":[1965,1972],"rehearse":"Puey Ungphakorn, the son of a fishmonger, won a government scholarship to the London School of Economics in 1938."},{"id":"r_scholar_2","stage":2,"min":25,"max":25,"category":"work","title":"A ruling for the general","prompt":"You came back with a London degree and a desk by the fan at the Finance Ministry. A general’s family company wants a tax ruling nobody else could get, and your section head has left the file on your chair with an envelope on top. Everyone keeps saying the old days ended in October.","options":[{"id":"refuse","label":"Send back the envelope and write no","outcome":"You were moved to the department that counts rice. Your memo was kept, and it was correct.","health":-2,"wellbeing":3,"skills":{"drive":2,"iq":1},"flag":"r_scholar_2"},{"id":"sign","label":"Write the ruling and keep the envelope","outcome":"Nothing happened, which was the arrangement. You left for the general’s bank within two years, and your bond was paid off for you.","cash":110000,"wellbeing":-8},{"id":"resign","label":"Resign and pay back the bond","outcome":"It took your father’s savings and your brother’s. You have been a private person ever since, and nobody has asked your opinion.","cash":-60000,"health":1,"wellbeing":-3,"skills":{"iq":1}}],"years":[1970,1975],"rehearse":"Puey Ungphakorn joined the Finance Ministry in 1949 and governed the central bank from 1959 to 1971, the youngest and longest serving in the post."},{"id":"r_scholar_3","stage":3,"min":30,"max":30,"category":"work","title":"The morning of 6 October","prompt":"You had put your name on a letter to the papers, one of forty. On 6 October 1976 people were killed on the football field at Thammasat, and a clerk you once helped rang to say the list at the ministry now had you on it. You did not go back for your books.","options":[{"id":"happened","label":"What happened","outcome":"You left with a briefcase and have not been back. The ministry sent the unpaid part of your bond to your father, who had signed as guarantor.","health":-6,"wellbeing":-18,"skills":{"eq":2},"flag":"r_scholar_3"}],"years":[1976,1980],"rehearse":"Puey Ungphakorn, rector of Thammasat, left Thailand on 6 October 1976 and never lived there again."},{"id":"r_scholar_4","stage":4,"min":40,"max":65,"category":"connection","title":"A letter from the faculty","prompt":"The charges, such as they were, lapsed years ago. A former junior of yours now runs a faculty and writes that there is a chair for you, and a hall that wants to hear you. You have a rented flat in Ealing and a doctor who has told you to avoid long flights.","options":[{"id":"home","label":"Fly home and take the chair","outcome":"Students too young to have been there filled the hall and took notes. You taught for eleven years, and they named a small room after you.","cash":30000,"health":-4,"wellbeing":10,"skills":{"eq":2},"flag":"r_scholar_4"},{"id":"stop","label":"Write back no and stop reading Thai newspapers","outcome":"You took up an allotment. Your Thai went strange, and your nephews corrected it on the telephone.","health":2,"wellbeing":-4,"skills":{"eq":1}},{"id":"book","label":"Stay and finish the history of it","outcome":"The book took nine years and all the money you had. A stroke took your right hand in the last chapter, and the publisher in Bangkok sent regrets.","cash":-40000,"health":-22,"wellbeing":-16,"skills":{"iq":2},"flag":"r_scholar_4"}],"years":[1985,2014],"rehearse":"Puey Ungphakorn had a stroke in 1977 that cost him his speech and the use of his right hand, and he died in London in 1999."}]},{"route":"luk_thung","fit":{"classes":["low_class","working_class"],"sex":null,"years":[1949,1970]},"scenes":[{"id":"r_luk_thung_1","stage":1,"min":15,"max":15,"category":"work","title":"The band needs a voice","prompt":"You cut cane from first light, and you know every song on the radio by heart because nobody taught you to read the words. At the temple fair a touring band’s singer has gone home sick, and the bandleader asks who knows the second verse. Your mother is holding the cane money.","options":[{"id":"stage","label":"Climb on the stage","outcome":"You got through two songs and a man threw a coin. You left on the band’s truck that week with your clothes in a rice sack.","cash":1500,"wellbeing":5,"skills":{"craft":2,"drive":1},"flag":"r_luk_thung_1"},{"id":"cane","label":"Stay with the cane","outcome":"The band left in the morning. The cane was cut by March, and your back told you so.","cash":3000,"health":-3,"wellbeing":-3,"skills":{"physique":1}}],"years":[1960,1990],"rehearse":"Pumpuang Duangjan left school after two years to cut sugarcane and began performing professionally at 15, when a visiting band noticed her."},{"id":"r_luk_thung_2","stage":2,"min":20,"max":25,"category":"money","title":"Four pages you cannot read","prompt":"A man from a Bangkok label says the crowds ask for you by name, and he has a contract. It is four pages and you cannot read them. The bandleader says a fifth of everything is fair, and he has said that before.","options":[{"id":"teacher","label":"Have a schoolteacher read it first","outcome":"She found the clause that gave the label your name for life, and they took it out, sulking. The first batch sold out in the north-east.","cash":5000,"wellbeing":3,"skills":{"iq":1,"drive":1},"flag":"r_luk_thung_2"},{"id":"sign","label":"Sign where he points","outcome":"The record sold. A year later you found out that the song, the name and the bus all belonged to him.","cash":25000,"health":-2,"wellbeing":4,"flag":"r_luk_thung_2"},{"id":"home","label":"Go home with what you have","outcome":"You sang at weddings in three districts. Nobody from Bangkok came looking again.","cash":6000,"health":1,"wellbeing":2,"skills":{"eq":1}}],"rehearse":"Pumpuang Duangjan could not read, and her earnings did not always stay under her control."},{"id":"r_luk_thung_3","stage":3,"min":25,"max":35,"category":"health","title":"What the doctor found","prompt":"You collapsed behind the stage at a fair in Nakhon Sawan, still in the costume. The doctor says your own blood has started attacking your kidneys, and that the treatment costs more than the band has paid you in a year. The next date is in four days.","options":[{"id":"happened","label":"What happened","outcome":"You sang the date and the next forty, because the contracts had no clause for it. You wore long sleeves on stage and nobody asked.","health":-20,"wellbeing":-10,"skills":{"drive":1},"flag":"r_luk_thung_3"}],"rehearse":"Pumpuang Duangjan died of lupus on 13 June 1992, aged 30."},{"id":"r_luk_thung_4","stage":4,"min":40,"max":60,"category":"health","title":"Forty provinces","prompt":"A younger singer is wearing your old songs on the television. A promoter offers one last tour of forty provinces, at a price that would pay for the treatment and buy back your name. The doctor has written on a card how many nights you have in you, and it is a smaller number.","options":[{"id":"tour","label":"Take the tour and the rights to your songs","outcome":"The crowd in Khon Kaen knew the words before you sang them. Your name is on the deed to the songs now, and on a school in your district.","cash":150000,"health":-8,"wellbeing":10,"skills":{"craft":1},"flag":"r_luk_thung_4"},{"id":"teach","label":"Stop, and teach the children at the temple","outcome":"You taught them to hold a note over a loud generator. You never took the stage again, and the radio had stopped playing you by the rains.","health":6,"wellbeing":3,"skills":{"eq":2}},{"id":"own","label":"Borrow against the house for your own band","outcome":"The tour lost money in eleven provinces out of forty. The bus was repossessed with your costumes in it.","cash":-90000,"health":-15,"wellbeing":-18,"skills":{"drive":1},"flag":"r_luk_thung_4"}],"rehearse":"Pumpuang Duangjan signed with the Topline label in 1986 and recorded a steady run of albums until 1992."}]},{"route":"boxer","fit":{"classes":["low_class","working_class"],"sex":"male","years":[1949,2000]},"scenes":[{"id":"r_boxer_1","stage":1,"min":15,"max":15,"category":"work","title":"The gym behind the mill","prompt":"A gym behind the rice mill feeds and houses any boy who fights. A boy your size brought home a month of rice from one night at the temple fair, and the trainer has looked at your shins. School is the other direction.","options":[{"id":"gym","label":"Move into the gym","outcome":"You slept under the ring with nine others. You lost your first fight, and the trainer took half of nothing.","cash":2000,"health":-3,"wellbeing":2,"skills":{"physique":3,"drive":1},"flag":"r_boxer_1"},{"id":"school","label":"Stay at school","outcome":"You finished lower secondary. You still watch the fights on Saturday, and you still kick at the television.","health":1,"skills":{"iq":2}}],"rehearse":"Pone Kingpetch turned professional in Hua Hin in 1954, aged 19, after telling friends he would be the first Thai world champion."},{"id":"r_boxer_2","stage":2,"min":20,"max":25,"category":"money","title":"The Lumpinee card","prompt":"You have reached the Bangkok circuit, and a promoter offers a title shot if you can drop four kilos in nine days. A man in the third row, whom you have never met, would like the fight to end in the fourth round. Your mother’s roof is leaking.","options":[{"id":"straight","label":"Make the weight and fight straight","outcome":"You won on points and passed blood for two days. The belt is kept at the gym, which owns it.","cash":20000,"health":-6,"wellbeing":5,"skills":{"physique":2,"drive":1},"flag":"r_boxer_2"},{"id":"dive","label":"Take the man’s money and go down","outcome":"You went down in the fourth, as agreed. Nobody booked you again, because the man in the third row told them why.","cash":60000,"health":-4,"wellbeing":-12}],"rehearse":"Pone Kingpetch beat Pascual Perez in 1960 to become the first Thai world boxing champion."},{"id":"r_boxer_3","stage":3,"min":25,"max":35,"category":"health","title":"The edge of the eye","prompt":"In the sixth round something went dark at the edge of your left eye, and you finished anyway. The doctor says the retina has come away and one more hard punch will take the rest. The manager has fights booked until the rains.","options":[{"id":"happened","label":"What happened","outcome":"The manager found a doctor who would sign the form. You fought three more years seeing half the ring, and learned to keep your head to the right.","health":-18,"wellbeing":-8,"skills":{"drive":2},"flag":"r_boxer_3"}],"rehearse":"Pone Kingpetch lost and regained his title against Japanese champions between 1962 and 1964."},{"id":"r_boxer_4","stage":4,"min":35,"max":55,"category":"money","title":"Where the purses went","prompt":"You have a name, a bad eye, and savings in an account your manager has stopped mentioning. A cousin wants your money for a restaurant and a school with your name on it, and the old gym would give you a corner and twelve boys. A promoter in Japan will still pay for one more.","options":[{"id":"corner","label":"Take the corner and train the boys","outcome":"One of your boys won the belt you lost. You held the water bucket, and they put you on television holding it.","cash":40000,"health":2,"wellbeing":9,"skills":{"eq":3},"flag":"r_boxer_4"},{"id":"rice","label":"Go home and work your brother’s rice","outcome":"Your hands swell every monsoon. Nobody in the village has asked you to fight, and you have told them so anyway.","cash":5000,"health":4,"wellbeing":-4,"skills":{"craft":1}},{"id":"cousin","label":"Put everything into the cousin’s school","outcome":"The restaurant closed in fourteen months and the school went to the bank. Diabetes took two toes the year the sign came down.","cash":-120000,"health":-10,"wellbeing":-20,"flag":"r_boxer_4"}],"rehearse":"Pone Kingpetch put his earnings into businesses that failed, lost the school he had built, and died at 47 in 1982."}]},{"route":"novice","fit":{"classes":["low_class","working_class"],"sex":"male","years":[1949,2000]},"scenes":[{"id":"r_novice_1","stage":1,"min":15,"max":15,"category":"family","title":"The only free school","prompt":"There is no money for upper school, and the abbot says a novice eats and learns for nothing. Your father shaves your head at the well and tells you that you can always leave. Pali starts at five in the morning.","options":[{"id":"robe","label":"Put on the robe and stay","outcome":"You learned two scripts and how to be hungry after noon. Village women began bowing to a boy whose ears they had once washed.","wellbeing":2,"skills":{"iq":2,"eq":1},"flag":"r_novice_1"},{"id":"fields","label":"Go with your uncle to the fields","outcome":"You planted rice and lost the Pali in two seasons. The robe went to a cousin.","cash":3000,"health":-2,"wellbeing":-1,"skills":{"physique":1}}],"rehearse":"Ajahn Chah, from a poor farming family in Isan, first entered a monastery as a novice at nine to learn to read and write."},{"id":"r_novice_2","stage":2,"min":20,"max":25,"category":"work","title":"A room in Bangkok","prompt":"You passed the Pali examinations, the first from this district. A temple in Bangkok offers a room and a place at the monks’ university, in return for sweeping and for serving an old monk who is difficult. You are old enough now to ordain or to leave.","options":[{"id":"ordain","label":"Ordain and take the bus to Bangkok","outcome":"The room had a fan and eleven other young men from the north-east. You washed the old monk’s feet and read his books at night.","health":-1,"wellbeing":2,"skills":{"iq":2,"drive":1},"flag":"r_novice_2"},{"id":"disrobe","label":"Disrobe and go home to your parents","outcome":"Your mother cried with relief and then with disappointment. You teach the village children their letters for a small sum, and the sum does not change.","cash":4000,"wellbeing":1,"skills":{"eq":2}}],"rehearse":"Ajahn Chah took full ordination on 26 April 1939, aged 20."},{"id":"r_novice_3","stage":3,"min":30,"max":40,"category":"family","title":"Nothing to inherit","prompt":"Word came from the village that your father had died. You went home for the cremation and found the field had been signed over years ago against a debt. Your sister looked at you the way people look at someone with a Bangkok salary, which a monk does not have.","options":[{"id":"happened","label":"What happened","outcome":"You went back to Bangkok, because your room was the only one you had. The abbot moved you to the office and put you in charge of the temple’s land rents.","health":-2,"wellbeing":-10,"skills":{"eq":2,"drive":1},"flag":"r_novice_3"}],"rehearse":"Ajahn Chah left settled monastery life after his father died and walked the forests for seven years."},{"id":"r_novice_4","stage":4,"min":45,"max":70,"category":"money","title":"Two hundred shophouses","prompt":"The old abbot has died, and a committee is deciding who keeps the keys, the accounts and the rents from two hundred shophouses. A developer has a proposal for the back half of the compound, with a large donation attached. You have started dreaming about the forest near home and a hut with a tin roof.","options":[{"id":"keys","label":"Turn down the developer and take the keys","outcome":"You kept the rents low and the school open. Four hundred boys with no money have now slept in your old room.","health":-3,"wellbeing":9,"skills":{"eq":2,"drive":1},"flag":"r_novice_4"},{"id":"forest","label":"Leave the keys and go to the forest","outcome":"You built the hut yourself. Nobody from Bangkok came, and after nine years the roof needed doing again.","health":5,"wellbeing":5,"skills":{"eq":3}},{"id":"donor","label":"Sign, and build what the donor wants","outcome":"The donation went through an account in your name. There was an audit, then a newspaper, then a police station, and they took the robe off you in a room with strip lighting.","cash":-80000,"health":-10,"wellbeing":-24,"flag":"r_novice_4"}],"rehearse":"Ajahn Chah founded Wat Nong Pah Pong in 1954 and spent about ten years paralysed and unable to speak before his death in 1992."}]},{"route":"painter","fit":{"classes":["low_class","working_class","middle_class"],"sex":null,"years":[1949,1981]},"scenes":[{"id":"r_painter_1","stage":1,"min":15,"max":15,"category":"work","title":"The walls of the school","prompt":"The district education officer has seen what you drew on the walls of the school and has not punished you, which surprises everybody. The ministry has one scholarship at the art college in Bangkok. Your father wanted someone to keep the accounts at the mill.","options":[{"id":"art","label":"Take the scholarship","outcome":"You copied plaster casts for two years. The teacher looked at your best one and said it was an excellent copy.","wellbeing":4,"skills":{"craft":3,"drive":1},"flag":"r_painter_1"},{"id":"mill","label":"Keep the mill’s accounts","outcome":"You were good at it. You draw the buyers on the backs of invoices, and then you throw the invoices away.","cash":6000,"wellbeing":-4,"skills":{"iq":1}}],"years":[1960,2000],"rehearse":"Thawan Duchanee began art studies at 15 on a Ministry of Education scholarship."},{"id":"r_painter_2","stage":2,"min":20,"max":30,"category":"money","title":"Film stars by the metre","prompt":"The big cinema pays cash for hoardings, twelve metres of a film star’s face, painted in a week. Your own canvases have sold twice, both times to a friend. An advertising agency has seen the hoardings and offers a salary.","options":[{"id":"both","label":"Paint hoardings by day, your own at night","outcome":"You slept four hours. The canvases got better, and the faces on the hoardings started to look worried.","cash":20000,"health":-6,"wellbeing":1,"skills":{"craft":3},"flag":"r_painter_2"},{"id":"agency","label":"Take the agency’s salary","outcome":"The salary was real and it came with a parking space. Your brushes dried in a jar.","cash":70000,"wellbeing":-3,"skills":{"iq":1}}],"years":[1965,2006],"rehearse":"Thawan Duchanee entered Silpakorn University in 1958, where a teacher called him a copier and not a true artist."},{"id":"r_painter_3","stage":3,"min":30,"max":45,"category":"connection","title":"They came with knives","prompt":"Your first real show opened at a university gallery, with the demons and monks you have been painting for ten years. On the third day a crowd of students came in and cut the canvases, because they had decided you were insulting the religion. A reporter asked for a comment while you were picking up the strips.","options":[{"id":"happened","label":"What happened","outcome":"You had no comment. Someone bought the strips, and the price of the next painting doubled.","health":-2,"wellbeing":-14,"skills":{"drive":3},"flag":"r_painter_3"}],"rehearse":"Thawan Duchanee had works destroyed by student protesters who read them as religious insult."},{"id":"r_painter_4","stage":4,"min":45,"max":70,"category":"work","title":"The ceiling or the land","prompt":"A temple abroad wants a ceiling, four years on a scaffold. In your home town there is empty land you have started drawing on. A collector offers to buy everything in the studio, your signature included, for a line of prints.","options":[{"id":"ceiling","label":"Paint the ceiling and take no other work","outcome":"Four years on your back, and officials wrote to complain about the faces. People now fly in to look at it.","cash":100000,"health":-8,"wellbeing":11,"skills":{"craft":3},"flag":"r_painter_4"},{"id":"sell","label":"Sell the studio to the collector","outcome":"Your signature now appears on place mats in two airports. You have not bought a tube of paint since.","cash":120000,"health":3,"wellbeing":-8,"skills":{"iq":1}},{"id":"land","label":"Put everything into your own temple","outcome":"The walls went up and the money went down. You live on the site, with the bank’s notices under a rock.","cash":-150000,"health":-16,"wellbeing":-16,"skills":{"drive":1},"flag":"r_painter_4"}],"rehearse":"Thawan Duchanee was named a National Artist in 2001 and died in 2014 after liver failure."}]},{"route":"actor","fit":{"classes":["low_class","working_class","middle_class","bureaucratic_class"],"sex":null,"years":[1949,1970]},"scenes":[{"id":"r_actor_1","stage":1,"min":20,"max":20,"category":"work","title":"Photographs at a magazine","prompt":"A friend has sent your photographs to a film magazine without asking. A producer wants you on Monday for a small part, and he has already chosen another name for you. You have a clerk’s job with a pension.","options":[{"id":"part","label":"Take the part and the new name","outcome":"You had three lines. Your mother went to the matinee twice and did not recognise the name on the poster.","cash":8000,"wellbeing":6,"skills":{"eq":2,"drive":1},"flag":"r_actor_1"},{"id":"clerk","label":"Keep the job and the pension","outcome":"You were made senior clerk at thirty. The film did well, and you know who got the part.","cash":12000,"wellbeing":-2,"skills":{"iq":1}}],"years":[1965,1995],"rehearse":"Mitr Chaibancha made his first film in 1956 after friends showed his photographs to a journalist and a magazine editor."},{"id":"r_actor_2","stage":2,"min":25,"max":35,"category":"health","title":"The fall from the truck","prompt":"You are the reason the film sells now, and the producer offers you a share if you do the fall from the moving truck yourself. A stunt double costs money and the audience can tell. The doctor’s note from last time is in your shirt.","options":[{"id":"fall","label":"Do the fall and take the share","outcome":"You broke a collarbone in the second take and they used the first. The queue went round the block.","cash":60000,"health":-10,"wellbeing":5,"skills":{"physique":2,"drive":1},"flag":"r_actor_2"},{"id":"tv","label":"Say no and go to television","outcome":"You played a kind uncle for nineteen years. Children in supermarkets call you by his name.","cash":20000,"health":2,"wellbeing":-3,"skills":{"eq":1}}],"rehearse":"Mitr Chaibancha began a screen partnership in 1961 that produced about 165 films."},{"id":"r_actor_3","stage":3,"min":30,"max":40,"category":"work","title":"The leading man has died","prompt":"The biggest star in the country died on a set, and the producers have a calendar of forty films with a hole in it. They telephoned you before the funeral was over. You knew him a little, and you owed him a small sum.","options":[{"id":"happened","label":"What happened","outcome":"You made thirty-one films in two years, four at a time, and learned to sleep standing up. His widow sent back your wreath.","cash":90000,"health":-4,"wellbeing":-4,"skills":{"drive":2},"flag":"r_actor_3"}],"rehearse":"Mitr Chaibancha died on 8 October 1970, aged 36, falling from a helicopter while filming his own production."},{"id":"r_actor_4","stage":4,"min":45,"max":65,"category":"money","title":"Second line of the poster","prompt":"The posters now show someone younger, and a studio wants you as a villain at a quarter of your old price. You could start your own company if you mortgage the house. Your knees have begun to ask about stairs.","options":[{"id":"villain","label":"Play the villain and play him well","outcome":"They gave you a lifetime award for the scar. You are on the second line of the poster, and the work is better than it was.","cash":40000,"wellbeing":10,"skills":{"eq":2,"craft":1},"flag":"r_actor_4"},{"id":"noodles","label":"Stop, and open a noodle shop","outcome":"People still bring your photograph to be signed. The noodles are all right.","cash":15000,"health":5,"wellbeing":1,"skills":{"craft":1}},{"id":"company","label":"Mortgage the house for your own film","outcome":"It opened in four cinemas in a week of heavy rain. The bank has the house and the negative.","cash":-140000,"health":-8,"wellbeing":-20,"skills":{"drive":1},"flag":"r_actor_4"}],"rehearse":"Mitr Chaibancha trained in Muay Thai and as a pilot before he ever appeared on film."}]},{"route":"dancer","fit":{"classes":["low_class","working_class","middle_class"],"sex":null,"years":[1955,2000]},"scenes":[{"id":"r_dancer_1","stage":1,"min":15,"max":15,"category":"work","title":"The monkey at the fair","prompt":"A teacher from the Fine Arts Department’s dance school saw you doing a monkey for your friends at a temple fair. There is a place for you, with a uniform and lunch, and a stick for your knees from dawn. Your parents have asked what it leads to.","options":[{"id":"school","label":"Take the place and kneel to the teacher","outcome":"You spent two years learning to hold one foot. At the teachers’ ceremony you touched the mask and were told not to enjoy it.","health":-2,"wellbeing":3,"skills":{"physique":2,"craft":3},"flag":"r_dancer_1"},{"id":"regular","label":"Go back to regular school","outcome":"Your friends still ask you to do the monkey at parties. You do it, and it gets worse each year.","health":1,"wellbeing":-1,"skills":{"iq":2}}]},{"id":"r_dancer_2","stage":2,"min":20,"max":30,"category":"money","title":"Between the satay and fruit","prompt":"The department’s troupe pays a civil servant’s salary and performs on Sundays to empty halls. A riverside hotel pays three times that for twenty minutes of Hanuman between the satay and the fruit. Your teacher has said nothing about it, loudly.","options":[{"id":"troupe","label":"Stay with the troupe","outcome":"You danced the white monkey in a hall with sixty people in it, forty of them relatives. The salary came on the last Friday of the month.","cash":8000,"wellbeing":4,"skills":{"craft":3},"flag":"r_dancer_2"},{"id":"hotel","label":"Dance for the hotel","outcome":"You got very good at twenty minutes. Tourists photographed you with the mask off, and your teacher sent back your New Year card.","cash":60000,"health":-2,"wellbeing":-6,"skills":{"eq":1}}]},{"id":"r_dancer_3","stage":3,"min":30,"max":40,"category":"health","title":"The knee went on Tuesday","prompt":"The knee that carried a demon’s weight for twenty years went during a rehearsal on a Tuesday. The surgeon says you can walk or you can dance, and the department’s scheme pays for walking. A foreign fellowship was offered in the same week.","options":[{"id":"happened","label":"What happened","outcome":"You took the fellowship on crutches. In New York you watched a woman lie on a floor for nine minutes, and that night you did not sleep.","cash":30000,"health":-14,"wellbeing":-6,"skills":{"drive":2},"flag":"r_dancer_3"}]},{"id":"r_dancer_4","stage":4,"min":40,"max":60,"category":"work","title":"The black room","prompt":"You have a small company and an idea: the old steps with the mask off, in a black room, with a foreign drummer. The department calls it a desecration. A ministry official says you could run the school, if you stop.","options":[{"id":"tour","label":"Make the piece and take it on tour","outcome":"It played in nineteen cities and won a prize in Europe. Your old teacher came once, sat near the door, and stayed to the end.","cash":80000,"health":-6,"wellbeing":11,"skills":{"craft":2,"drive":1},"flag":"r_dancer_4"},{"id":"run","label":"Run the school and stop","outcome":"You teach the foot to fifteen-year-olds. You do not tell them about the black room.","cash":30000,"health":3,"wellbeing":-5,"skills":{"eq":2}},{"id":"theatre","label":"Borrow and build your own theatre","outcome":"You paid rent on a hundred and twenty seats for four years. You closed it on a night with nine people in them.","cash":-130000,"health":-10,"wellbeing":-20,"skills":{"drive":1},"flag":"r_dancer_4"}]}]},{"route":"writer","fit":{"classes":["low_class","working_class","middle_class"],"sex":null,"years":[1949,1955]},"scenes":[{"id":"r_writer_1","stage":1,"min":15,"max":15,"category":"connection","title":"A novel without a cover","prompt":"Your mother sews so that you can stay at school, and a teacher has lent you a novel with the cover torn off. He says it is about people like your mother, and not to carry it on the bus. You have started writing in the back of your arithmetic book.","options":[{"id":"send","label":"Send a story to the magazine","outcome":"They printed it and paid the price of a pair of shoes. Your mother read it twice and asked whether it was about her.","cash":500,"wellbeing":5,"skills":{"iq":2,"craft":2},"flag":"r_writer_1"},{"id":"burn","label":"Burn the arithmetic book and study","outcome":"You passed the bank clerk’s exam at eighteen. You have written nothing since except the date.","health":1,"wellbeing":-1,"skills":{"iq":2}}],"years":[1960,1972],"rehearse":"Kulap Saipradit, whose father died young, had his schooling paid for by a dressmaker mother and a sister who danced."},{"id":"r_writer_2","stage":2,"min":20,"max":25,"category":"work","title":"Paid by the column","prompt":"A weekly will pay you by the column for what you saw in your village, and someone at the printer’s keeps asking whether the government has read it. A bank has also offered you a clerk’s stool. Your landlord has started reading you.","options":[{"id":"column","label":"Write it under your own name","outcome":"Three hundred letters came from people who had never seen their village in print. Two came from an office with no name on the door.","cash":3000,"health":-1,"wellbeing":4,"skills":{"craft":2,"drive":1},"flag":"r_writer_2"},{"id":"bank","label":"Take the stool and write at weekends","outcome":"The weekends got shorter. You have eleven pages of a novel in a biscuit tin.","cash":25000,"wellbeing":-3,"skills":{"iq":1}}],"years":[1969,1975],"rehearse":"Kulap Saipradit wrote three novels in 1928, at 22, and moved into journalism the next year."},{"id":"r_writer_3","stage":3,"min":25,"max":35,"category":"connection","title":"The list of banned books","prompt":"After October 1976 a list of banned books went up, and yours were on it. People burned their own shelves at night in the back yard. Two men came to the printer’s with your name on a piece of paper.","options":[{"id":"happened","label":"What happened","outcome":"You were held for two years without a charge anyone read out. You wrote a novel in your head and came out to find the last one still banned.","health":-8,"wellbeing":-16,"skills":{"eq":1,"drive":1},"flag":"r_writer_3"}],"years":[1976,1985],"rehearse":"Kulap Saipradit was arrested in 1952 and released in 1957, having written two volumes of a trilogy in prison."},{"id":"r_writer_4","stage":4,"min":45,"max":70,"category":"work","title":"A speech at a hotel","prompt":"The books are legal now, and a literature committee has written with a small prize and a speech at a hotel. A publisher will pay in advance for the next one with the politics taken out. A small press in the north would print the unsafe one, and would probably be visited.","options":[{"id":"speak","label":"Give the speech and publish the unsafe one","outcome":"The hall stood up, the police did not come, and it went to nine printings. Schoolchildren are now examined on your mother.","cash":20000,"health":-2,"wellbeing":11,"skills":{"iq":1,"drive":2},"flag":"r_writer_4"},{"id":"advance","label":"Take the advance and the politics out","outcome":"It sold well and you have never opened it. Your name is on the spine.","cash":70000,"wellbeing":-10},{"id":"self","label":"Print it yourself, with everything in it","outcome":"It sold four hundred copies. A libel case from a dead general’s family took the house.","cash":-70000,"health":-12,"wellbeing":-18,"skills":{"drive":1},"flag":"r_writer_4"}],"rehearse":"Kulap Saipradit could not go home after a 1958 coup while he was abroad, and he died in Beijing in 1974."}]},{"route":"student","fit":{"classes":["working_class","middle_class","bureaucratic_class"],"sex":null,"years":[1949,1955]},"scenes":[{"id":"r_student_1","stage":1,"min":20,"max":20,"category":"connection","title":"A leaflet needs a name","prompt":"You got here on exam marks, and your family has told the whole street. The student union needs a name at the bottom of the leaflet about the constitution, and nobody in the room is looking at anyone else. Someone has been photographing the noticeboard.","options":[{"id":"sign","label":"Sign your own name","outcome":"The printers ran two thousand copies. Your father found out from the neighbour who sells him ice.","wellbeing":4,"skills":{"eq":2,"drive":2},"flag":"r_student_1"},{"id":"other","label":"Let someone else sign","outcome":"You sat the civil service exam in your final year and passed well. The leaflet went out without you.","wellbeing":-2,"skills":{"iq":2}}],"years":[1968,1976]},{"id":"r_student_2","stage":2,"min":25,"max":30,"category":"connection","title":"Four days on foot","prompt":"On 6 October 1976 people were killed at Thammasat, and your friends stopped being at their addresses. You got a lift to the north-east, then walked four days into the forest with a bag of rice. The cadres were polite and gave you a new name.","options":[{"id":"happened","label":"What happened","outcome":"You carried rice, read Mao and had malaria three times. Your parents were visited every six months by a man who took notes.","health":-16,"wellbeing":-8,"skills":{"physique":2,"drive":2},"flag":"r_student_2"}],"years":[1976,1981]},{"id":"r_student_3","stage":3,"min":30,"max":35,"category":"work","title":"The amnesty has a form","prompt":"The government will let anyone walk out who signs, and the party is coming apart anyway over who was right. A university abroad would take you for a doctorate. An old friend is organising for the next election and needs someone who has been shot at.","options":[{"id":"stand","label":"Walk out and stand for election","outcome":"You went door to door in a shirt your sister ironed. You lost by four hundred votes, and the party asked you to try again.","health":-2,"wellbeing":4,"skills":{"eq":3,"drive":2},"flag":"r_student_3"},{"id":"abroad","label":"Go abroad and take the doctorate","outcome":"You studied for six years where it snowed. You came back to teach the subject you had tried to live.","cash":5000,"health":2,"wellbeing":3,"skills":{"iq":3}}],"years":[1980,1986]},{"id":"r_student_4","stage":4,"min":40,"max":65,"category":"money","title":"The road through the wetland","prompt":"You hold the seat now, and there is a ministry on offer. It comes with a man who wants a road through a wetland and who paid for part of your last campaign. A friend from the forest has stopped speaking to you, in writing.","options":[{"id":"refuse","label":"Refuse the road and take the ministry anyway","outcome":"You lasted fourteen months and passed one law, which is still in force. The wetland is still there.","cash":30000,"health":-4,"wellbeing":10,"skills":{"eq":2,"drive":1},"flag":"r_student_4"},{"id":"down","label":"Stand down and go home","outcome":"You keep a small orchard. You read the papers before lunch and do not telephone anyone.","health":4,"wellbeing":2,"skills":{"eq":1}},{"id":"road","label":"Take his money and build his road","outcome":"A commission spent two years on your accounts. You lost the seat, the right to stand and most of what he paid.","cash":-100000,"health":-6,"wellbeing":-25,"flag":"r_student_4"}],"years":[1992,2014]}]},{"route":"trader","fit":{"classes":["low_class","working_class","middle_class"],"sex":null,"years":[1949,1970]},"scenes":[{"id":"r_trader_1","stage":1,"min":15,"max":15,"category":"family","title":"Above the sacks","prompt":"Your father sells dried goods from a shophouse in Phichit, and the family sleeps above the sacks. He is taking you out of school this week, because your brother has gone to Bangkok and the ledger needs someone who can count. Your teacher has come to argue and has been given tea.","options":[{"id":"ledger","label":"Stay and learn the ledger","outcome":"You learned who pays late and why. By eighteen you were giving credit to men who had once patted your head.","cash":3000,"wellbeing":-1,"skills":{"iq":1,"craft":2,"drive":1},"flag":"r_trader_1"},{"id":"teacher","label":"Go back with the teacher","outcome":"You finished school and took the exam for the post office. The shop went to a cousin when your father died, at a family price.","health":1,"wellbeing":1,"skills":{"iq":3}}],"years":[1960,1990],"rehearse":"Chaleo Yoovidhya grew up in Phichit in a family that raised ducks and sold fruit, with little schooling."},{"id":"r_trader_2","stage":2,"min":25,"max":45,"category":"money","title":"Dollars at low interest","prompt":"The bank’s man drives up from Bangkok in a new car, offering dollar loans at a rate the old moneylender would laugh at. You could own the warehouse, the trucks and the land by the bypass that everyone says is going up. Your father never owed anyone past the first of the month.","options":[{"id":"borrow","label":"Borrow in dollars and buy the land","outcome":"You signed in a hotel with a fish tank. The land doubled on paper before the ink was dry.","cash":100000,"health":-4,"wellbeing":3,"skills":{"iq":1,"drive":2},"flag":"r_trader_2"},{"id":"small","label":"Pay your debts and keep the one shop","outcome":"People laughed at your old trucks at the temple dinner. You paid your suppliers on the first of every month.","cash":5000,"wellbeing":2,"skills":{"eq":1}}],"years":[1993,1996],"rehearse":"Chaleo Yoovidhya moved to Bangkok as a young man, sold antibiotics, and founded a small pharmaceutical firm in the early 1960s."},{"id":"r_trader_3","stage":3,"min":30,"max":50,"category":"money","title":"The baht has gone","prompt":"In July 1997 the baht was floated and your dollar loan nearly doubled in the time it took to read the paper. The finance company shut its doors with your land papers inside. The man in the new car no longer has a telephone number.","options":[{"id":"happened","label":"What happened","outcome":"You sold the trucks, then the land for a third of the debt. You kept the shophouse, and you are sleeping above the sacks again.","health":-10,"wellbeing":-16,"skills":{"drive":2,"iq":1},"flag":"r_trader_3"}],"years":[1997,2001],"rehearse":"Chaleo Yoovidhya introduced the energy drink Krating Daeng in 1976, when he was about 52."},{"id":"r_trader_4","stage":4,"min":45,"max":70,"category":"money","title":"A foreigner likes your tonic","prompt":"The tonic you mix in the back room for truck drivers has outlasted everything else you owned. A foreign marketer tried it on a business trip and wants to put it in a slim can and sell it on three continents. He wants half, and a signature by Friday.","options":[{"id":"half","label":"Sign and give him half","outcome":"The can sold in forty countries. Your name appears on lists, and the shophouse is kept as it was, with a guard.","cash":200000,"health":-2,"wellbeing":8,"skills":{"iq":1,"drive":1},"flag":"r_trader_4"},{"id":"niece","label":"Hand the shop to your niece and stop","outcome":"You sit out front and count the trucks. Your niece has stopped asking what you think of the ledger.","cash":20000,"health":6,"wellbeing":3,"skills":{"eq":2}},{"id":"alone","label":"Borrow again and build the factory alone","outcome":"The bank’s terms had not changed. This time it took the shophouse.","cash":-150000,"health":-14,"wellbeing":-20,"skills":{"drive":1},"flag":"r_trader_4"}],"years":[2004,2026],"rehearse":"Chaleo Yoovidhya launched an export version of his drink in 1987 with a foreign partner, each putting in US$500,000, and died in 2012."}]},{"route":"taxi","fit":{"classes":["low_class","working_class"],"sex":"male","years":[1955,2000]},"scenes":[{"id":"r_taxi_1","stage":1,"min":20,"max":20,"category":"family","title":"The second field is dry","prompt":"The rains came late and the second field is dry, and there are four of you eating what the first field gave. A cousin in Bangkok has a floor in Din Daeng and knows a man at a construction site. The bus leaves Roi Et at six.","options":[{"id":"bus","label":"Take the bus","outcome":"You carried cement for two years and sent home a third of it. You learned the city from the back of a pickup.","cash":2000,"health":-1,"wellbeing":-2,"skills":{"drive":2},"flag":"r_taxi_1"},{"id":"stay","label":"Stay and try the second field again","outcome":"It rained the next year. You have still not seen the sea.","health":-2,"skills":{"craft":1}}]},{"id":"r_taxi_2","stage":2,"min":25,"max":40,"category":"work","title":"A car by the shift","prompt":"Anyone with a licence can rent a taxi now, twelve hours at a time, and the owner does not care whether you know where Sukhumvit ends. In a good week you would clear more than the site pays in a month, and in a bad week you owe him. Your back has been asking you to stop carrying things.","options":[{"id":"rent","label":"Rent the car and drive nights","outcome":"You learned every short cut and every police post. You slept in the car at Hua Lamphong with your feet out of the window.","cash":30000,"health":-6,"wellbeing":-2,"skills":{"drive":2},"flag":"r_taxi_2"},{"id":"home","label":"Go home and put in cassava","outcome":"You planted cassava and the price fell, and you planted it again. Your back stopped hurting.","cash":4000,"health":3,"wellbeing":1,"skills":{"craft":2}}],"years":[1993,2026]},{"id":"r_taxi_3","stage":3,"min":35,"max":55,"category":"health","title":"Four in the morning","prompt":"At four in the morning on the Bang Na road a truck came through the light and took the front of the car. You spent nine days in hospital. The owner wants the repair, and the hire for every day the car was off the road.","options":[{"id":"happened","label":"What happened","outcome":"He kept your deposit and the papers for your motorbike. You went back to driving before the stitches came out.","health":-16,"wellbeing":-10,"skills":{"drive":1},"flag":"r_taxi_3"}]},{"id":"r_taxi_4","stage":4,"min":45,"max":65,"category":"money","title":"Paid by the kilometre","prompt":"You have driven longer than you ever farmed. There is enough saved for a deposit on your own car, or for a house on the land at home. A woman from your village runs a savings circle that has paid well for two years.","options":[{"id":"own","label":"Buy your own green and yellow taxi","outcome":"You paid off the last instalment and the car was yours. You put your mother’s photograph on the sun visor and drove nine more years.","cash":80000,"health":-6,"wellbeing":9,"skills":{"drive":2,"iq":1},"flag":"r_taxi_4"},{"id":"land","label":"Go home and build on the land","outcome":"You sit on the raised floor of a house you paid for by the kilometre. You still wake at four.","cash":15000,"health":6,"wellbeing":4,"skills":{"eq":2}},{"id":"circle","label":"Put it all in the savings circle","outcome":"The woman who ran it left for Laos. You drove eleven more years on a bad heart, because the rent does not wait.","cash":-70000,"health":-12,"wellbeing":-18,"flag":"r_taxi_4"}]}]},{"route":"abroad","fit":{"classes":["low_class","working_class"],"sex":"male","years":[1970,2000]},"scenes":[{"id":"r_abroad_1","stage":1,"min":20,"max":20,"category":"money","title":"The neighbour has a fridge","prompt":"The neighbour’s son came home from Singapore, and the family now has a concrete house and a fridge. An agent comes through on Thursdays with a list: steel fixers, two years, and a fee worth more than your father’s field. The bank in town will lend against the deed.","options":[{"id":"go","label":"Put up the deed and go","outcome":"You flew for the first time with a sheet of instructions in your shirt. The debt started on the day you landed.","wellbeing":-3,"skills":{"drive":2},"flag":"r_abroad_1"},{"id":"no","label":"Tell the agent no","outcome":"The neighbours built a second storey and stopped inviting you to things.","health":1,"wellbeing":-3,"skills":{"eq":1}}]},{"id":"r_abroad_2","stage":2,"min":25,"max":35,"category":"family","title":"Two more years","prompt":"You sleep in a container with eleven men from Udon, and you are tying steel on the thirtieth floor of somebody’s bank. Your contract ended in March, and the supervisor says there are two more years if you do not go home. The woman you were going to marry has written twice.","options":[{"id":"sign","label":"Sign for two more years","outcome":"You sent home enough for the deed and the ground floor. The second letter was the last one.","cash":90000,"health":-8,"wellbeing":-6,"skills":{"physique":1,"drive":1},"flag":"r_abroad_2"},{"id":"marry","label":"Go home and marry her","outcome":"You married on what was left and fixed motorbikes. The deed is still at the bank.","cash":20000,"health":2,"wellbeing":8,"skills":{"eq":2}}],"years":[1985,2035]},{"id":"r_abroad_3","stage":3,"min":30,"max":45,"category":"health","title":"He did not wake up","prompt":"The man in the next bunk, from two villages over, went to sleep after a sixteen-hour shift and did not wake up. The doctor wrote that the cause could not be found, and the company sent the body home with a month’s wages. Someone had to carry his things to his mother.","options":[{"id":"happened","label":"What happened","outcome":"You carried them. She asked whether he had been eating, and you said yes, and that was her only question.","health":-6,"wellbeing":-14,"skills":{"eq":3},"flag":"r_abroad_3"}]},{"id":"r_abroad_4","stage":4,"min":40,"max":65,"category":"work","title":"A mixer and a van","prompt":"Nobody will let you stay, whatever you have poured, and the permit is finished. You have a bad back, the words for every order in two languages, and money for one thing. A friend says that with a mixer and a van you could build for every family in the district with a son abroad.","options":[{"id":"mixer","label":"Buy the mixer and start building","outcome":"You have built forty-one houses in three districts. Yours is the plain one.","cash":120000,"health":-4,"wellbeing":10,"skills":{"craft":2,"drive":1},"flag":"r_abroad_4"},{"id":"stay","label":"Stay home and let the field be","outcome":"It is a concrete house and you sit downstairs in it. The upstairs has never had furniture.","health":5,"wellbeing":2,"skills":{"eq":1}},{"id":"again","label":"Go back for one more contract","outcome":"The agent’s fee had gone up and your back had not. You fell four metres in the second month and came home to the ground floor you had paid for.","cash":-90000,"health":-20,"wellbeing":-16,"flag":"r_abroad_4"}]}]},
  {
    "route": "soi_compound",
    "fit": {
      "classes": ["high_class"],
      "sex": null,
      "years": [1981, 2000]
    },
    "scenes": [
      {
        "id": "r_soi_compound_1",
        "stage": 1,
        "min": 15,
        "max": 15,
        "category": "family",
        "title": "A crest on the envelope",
        "prompt": "A boarding school in England has written to your father, and the envelope has a crest. Your friends at the international school are already choosing universities abroad. Khun Yai says a child should know how to write a letter in Thai before leaving.",
        "options": [
        {
          "id": "go",
          "label": "Fly to the school in September",
          "outcome": "You learned to queue for a shower at six in the morning. Your Thai letters to Khun Yai got shorter every term.",
          "wellbeing": -2,
          "skills": {"iq": 2, "eq": 1},
          "flag": "r_soi_compound_1"
        },
        {
          "id": "stay",
          "label": "Stay in Bangkok and finish here",
          "outcome": "You stayed. Your Thai got better and your network got smaller, and both mattered later.",
          "wellbeing": 2,
          "skills": {"eq": 2},
        }
      ]
      ,
      "rehearse": "Study abroad lets a family skip the national exam route entirely. The Thai route has been TCAS since 2018."
      },
      {
        "id": "r_soi_compound_2",
        "stage": 2,
        "min": 20,
        "max": 25,
        "category": "work",
        "title": "A desk with your name already on it",
        "prompt": "Your father has had a desk made for you on the fourth floor, next to the window, with your name on a brass plate. A friend from university wants you in Singapore to build something that is not yet anything. The plate is already screwed on.",
        "options": [
        {
          "id": "desk",
          "label": "Sit at the desk",
          "outcome": "By the end of the first year the suppliers called you Khun by your first name. Nobody ever asked whether you were good at it.",
          "cash": 60000,
          "wellbeing": -3,
          "skills": {"craft": 1, "eq": 1},
          "flag": "r_soi_compound_2"
        },
        {
          "id": "leave",
          "label": "Go to Singapore",
          "outcome": "It failed in two years. You came home poorer, and the desk was still waiting, which was its own kind of humiliation.",
          "cash": -80000,
          "wellbeing": 3,
          "skills": {"drive": 3},
        }
      ]
      
      },
      {
        "id": "r_soi_compound_3",
        "era": [2011, 2011],
        "stage": 3,
        "min": 25,
        "max": 40,
        "category": "money",
        "title": "Water in the industrial estate",
        "prompt": "The river has come over the barrier at the estate. The factory floor is under two metres of water, and four hundred workers are waiting at the gate to hear whether there is a next month. The bank has called before the insurer has.",
        "options": [
        {
          "id": "close",
          "label": "Lay them off and claim the insurance",
          "outcome": "The numbers recovered by spring. You did not go to the gate on the day they collected their things.",
          "cash": 40000,
          "wellbeing": -6,
          "flag": "r_soi_compound_3"
        },
        {
          "id": "pay",
          "label": "Pay the workers through the closure",
          "outcome": "It cost a year of profit. Half of them came back when the lines restarted, and one of them still brings your mother mangoes.",
          "cash": -150000,
          "wellbeing": 4,
          "skills": {"eq": 2},
          "flag": "r_soi_compound_3"
        }
      ]
      ,
      "rehearse": "The 2011 floods affected more than 13 million people and flooded whole industrial estates. The World Bank put the losses at about 1.43 trillion baht."
      },
      {
        "id": "r_soi_compound_4",
        "stage": 4,
        "min": 45,
        "max": 60,
        "category": "family",
        "title": "Three signatures on the land",
        "prompt": "Your father has died, and the land on Sukhumvit is in all three of your names. Your sister wants to sell to a developer, and your brother wants to build. Your mother says nothing and has stopped eating dinner with any of you.",
        "options": [
        {
          "id": "split",
          "label": "Sell and split it three ways",
          "outcome": "You were all richer by the end of the year. You meet your brother at weddings now.",
          "cash": 300000,
          "wellbeing": -5,
          "flag": "r_soi_compound_4"
        },
        {
          "id": "give",
          "label": "Sign your share to your mother",
          "outcome": "It was the most expensive thing you ever did. She started eating dinner again.",
          "cash": -100000,
          "wellbeing": 6,
          "skills": {"eq": 2},
          "flag": "r_soi_compound_4"
        }
      ]
      ,
      "rehearse": "An inheritance can be a buffer and a quarrel at the same time. No figure is claimed here."
      }
    ]
  },
  {
    "route": "scholarship_kid",
    "fit": {
      "classes": ["working_class", "middle_class"],
      "sex": null,
      "years": [1970, 2000]
    },
    "scenes": [
      {
        "id": "r_scholarship_kid_1",
        "stage": 1,
        "min": 15,
        "max": 15,
        "category": "work",
        "title": "Scholarships are for the clever ones",
        "prompt": "An aunt at Songkran says it kindly: scholarships are for the clever children, and you should learn a trade. Your father pays for a tutor school on Saturdays with money that was meant for the roof. You have a desk lamp and a stack of old exam papers.",
        "options": [
        {
          "id": "study",
          "label": "Study as if she were wrong",
          "outcome": "You did the papers in the order they were printed, twice. You stopped going to the river with your friends, and you never quite went back.",
          "health": -1,
          "wellbeing": -4,
          "skills": {"iq": 3, "drive": 2},
          "flag": "r_scholarship_kid_1"
        },
        {
          "id": "believe",
          "label": "Believe her and learn a trade",
          "outcome": "You were good with your hands and paid your own way by twenty. Sometimes you wondered.",
          "cash": 15000,
          "wellbeing": 2,
          "skills": {"craft": 3},
        }
      ]
      ,
      "rehearse": "Belief is a gate. About 5% of children from the poorest fifth reach a bachelor's degree, against a national average of about 32% (Equitable Education Fund)."
      },
      {
        "id": "r_scholarship_kid_2",
        "stage": 2,
        "min": 20,
        "max": 25,
        "category": "work",
        "title": "Two letters on the same day",
        "prompt": "Two letters arrive on the same day. One is a government scholarship: two years abroad, and four years owed back to the service. The other is a foreign university's own money, with no bond and no one to call if it ends. Your father reads the bond page twice and asks who will be your guarantor.",
        "options": [
        {
          "id": "bond",
          "label": "Take the bond, and your uncle signs",
          "outcome": "You owed the state four years and your uncle a favour. Both were collected.",
          "wellbeing": 1,
          "skills": {"iq": 2},
          "flag": "r_scholarship_kid_2"
        },
        {
          "id": "free",
          "label": "Take the university's money",
          "outcome": "Nobody owed you anything and you owed no one. The first winter you learned what that means.",
          "wellbeing": -2,
          "skills": {"iq": 2, "drive": 1},
          "flag": "r_scholarship_kid_2"
        }
      ]
      ,
      "rehearse": "Government scholarship bonds commonly ask for twice the funded years in service. On a breach the money is repaid with a penalty on top, and the guarantor can be held liable. The terms differ by agency, so read the contract."
      },
      {
        "id": "r_scholarship_kid_3",
        "stage": 3,
        "min": 25,
        "max": 30,
        "category": "family",
        "title": "The call at four in the morning",
        "prompt": "It is four in the morning where you are and the middle of the afternoon at home. Your mother says your father went to lie down after lunch. The funeral is seven nights. Your exams are in nine days, and your head of department has already been kind once this year.",
        "options": [
        {
          "id": "stay",
          "label": "Sit the exams, fly after",
          "outcome": "You passed. You arrived for the cremation. Your mother never mentioned it, and that was the hardest part.",
          "wellbeing": -14,
          "skills": {"iq": 1},
          "flag": "r_scholarship_kid_3"
        },
        {
          "id": "fly",
          "label": "Fly tonight",
          "outcome": "You arrived for the second night. Your mother held your arm at every ceremony.",
          "cash": -40000,
          "wellbeing": -10,
          "skills": {"eq": 3},
          "flag": "r_scholarship_kid_3"
        }
      ]
      ,
      "rehearse": "If this happens: say yes to one thing and let relatives carry the rest. Mental Health Hotline 1323."
      },
      {
        "id": "r_scholarship_kid_4",
        "stage": 4,
        "min": 35,
        "max": 45,
        "category": "work",
        "title": "The other door",
        "prompt": "You have the title and the office and a student who cried in it last week. A public agency wants someone to make cities measure what they promise, at a desk in Bangkok, with politics. Your colleagues say you would be wasting the doctorate.",
        "options": [
        {
          "id": "go",
          "label": "Leave the university",
          "outcome": "The first year you were the professor in every meeting, and nobody liked it. By the third, two provinces were using the measures you wrote.",
          "cash": 20000,
          "wellbeing": 3,
          "skills": {"craft": 2, "eq": 1},
          "flag": "r_scholarship_kid_4"
        },
        {
          "id": "stay",
          "label": "Stay for the chair",
          "outcome": "You got it at forty-four. Your student finished, and she sends a card every New Year.",
          "wellbeing": 2,
          "skills": {"iq": 2},
        }
      ]
      ,
      "rehearse": "Leaving academia keeps the skills and changes the network. No income figure is claimed here."
      },
      {
        "id": "r_scholarship_kid_5",
        "stage": 5,
        "min": 50,
        "max": 60,
        "category": "family",
        "title": "Your mother's stairs",
        "prompt": "Your mother can no longer manage the stairs in the suburban house your father paid for in instalments. Your sister has two children and a job in Chonburi. Everyone already knows whose turn it is.",
        "options": [
        {
          "id": "sister",
          "label": "Ask your sister to take her turn",
          "outcome": "Your sister took her for a year. Your mother called you every night to say she was fine.",
          "wellbeing": -4,
          "skills": {"eq": 1},
          "flag": "r_scholarship_kid_5"
        },
        {
          "id": "move",
          "label": "Move her into your flat",
          "outcome": "She rearranged your kitchen in a week and slept better than she had in years. You slept worse.",
          "cash": -30000,
          "wellbeing": 2,
          "skills": {"eq": 2},
          "flag": "r_scholarship_kid_5"
        },
        {
          "id": "pay",
          "label": "Pay a carer at the house",
          "outcome": "The carer was good. You visited on Sundays and left before dinner, every time a little earlier.",
          "cash": -90000,
          "wellbeing": -3,
          "flag": "r_scholarship_kid_5"
        }
      ]
      ,
      "rehearse": "About one Thai in five is aged 60 or over. 12.9% of older people lived alone in 2024 (National Statistical Office)."
      }
    ]
  },
  {
    "route": "kharatchakan",
    "fit": {
      "classes": ["bureaucratic_class"],
      "sex": null,
      "years": [1949, 2000]
    },
    "scenes": [
      {
        "id": "r_kharatchakan_1",
        "stage": 1,
        "min": 20,
        "max": 25,
        "category": "work",
        "title": "The posting",
        "prompt": "You passed the civil-service exam, and the letter posts you to a school four hours from your mother, at the end of a laterite road. A friend of your father's at the provincial office says a transfer nearer home could be arranged. Everyone knows what arranged means.",
        "options": [
        {
          "id": "accept",
          "label": "Go to the end of the road",
          "outcome": "You taught forty children in one room for three years. Two of them became teachers, and one wrote to you.",
          "wellbeing": -2,
          "skills": {"eq": 2, "drive": 1},
          "flag": "r_kharatchakan_1"
        },
        {
          "id": "ask",
          "label": "Let him arrange it",
          "outcome": "You were home by the new year. Eight years later his nephew needed a place at your school, and you found one.",
          "wellbeing": 2,
          "skills": {"eq": 1},
          "flag": "r_kharatchakan_1"
        }
      ]
      ,
      "rehearse": "Postings and transfers move through seniority and patronage (\u0e1d\u0e32\u0e01\u0e40\u0e2a\u0e49\u0e19). A favour is a ledger entry that comes back. No figure is claimed here."
      },
      {
        "id": "r_kharatchakan_2",
        "era": [1997, 2001],
        "stage": 2,
        "min": 25,
        "max": 30,
        "category": "money",
        "title": "Rice in an iron pot",
        "prompt": "The baht has gone. Your friend from university who joined a finance company is selling his car at the market on Sunday. Your salary arrived on the twenty-fifth as it always does, and your mother says she told you so.",
        "options": [
        {
          "id": "save",
          "label": "Keep it and pay down the cooperative loan",
          "outcome": "You were debt-free a year early, and you felt it as safety rather than happiness.",
          "cash": 10000,
          "wellbeing": 1,
          "flag": "r_kharatchakan_2"
        },
        {
          "id": "lend",
          "label": "Lend your friend enough for three months",
          "outcome": "He paid back half. He still calls you on your birthday.",
          "cash": -20000,
          "wellbeing": 2,
          "skills": {"eq": 1},
          "flag": "r_kharatchakan_2"
        }
      ]
      ,
      "rehearse": "Thailand's economy shrank by about 2.8% in 1997 and 7.6% in 1998. A state salary kept arriving."
      },
      {
        "id": "r_kharatchakan_3",
        "stage": 3,
        "min": 35,
        "max": 45,
        "category": "family",
        "title": "Your father's bed",
        "prompt": "Your father is in the provincial hospital with his heart, in the government ward with the fans. The bill is already under your name, because your scheme covers your parents. Your brother, who sells cars, says he will pay for a private room.",
        "options": [
        {
          "id": "ward",
          "label": "Keep him on your cover",
          "outcome": "He complained about the fan and the food and lived nine more years. Your brother bought him a television instead.",
          "wellbeing": 2,
          "skills": {"eq": 1},
          "flag": "r_kharatchakan_3"
        },
        {
          "id": "private",
          "label": "Let your brother pay for the private room",
          "outcome": "Your brother paid, and reminded the family at every funeral after.",
          "cash": 0,
          "wellbeing": -2,
          "flag": "r_kharatchakan_3"
        }
      ]
      ,
      "rehearse": "The civil servants' medical scheme covers the officer, the spouse, the parents and the children."
      },
      {
        "id": "r_kharatchakan_4",
        "stage": 4,
        "min": 40,
        "max": 55,
        "category": "money",
        "title": "A colleague's form",
        "prompt": "A colleague of twenty years needs a guarantor for a cooperative loan to pay his son's debts. It is one signature. He is a deputy director, and you will see him every morning until you retire.",
        "options": [
        {
          "id": "refuse",
          "label": "Say you cannot",
          "outcome": "He found someone else. He was correct with you until he retired, and never warm.",
          "wellbeing": -3,
          "skills": {"drive": 1},
          "flag": "r_kharatchakan_4"
        },
        {
          "id": "sign",
          "label": "Sign it",
          "outcome": "He paid for four years and then had a stroke. The cooperative deducted the rest from your salary, politely, every month.",
          "cash": -80000,
          "wellbeing": -6,
          "flag": "r_kharatchakan_4"
        }
      ]
      ,
      "rehearse": "If you are asked to guarantee a loan, read who pays if the borrower cannot. Debt passes between lives through guarantors. No rate is claimed here."
      },
      {
        "id": "r_kharatchakan_5",
        "stage": 5,
        "min": 60,
        "max": 60,
        "category": "work",
        "title": "The last morning",
        "prompt": "On your last morning the students line up with jasmine garlands, and the director gives a speech with your name spelled wrong. From next month the pension arrives on the same day the salary did, and the same card still covers your parents and your spouse.",
        "options": [
        {
          "id": "happened",
          "label": "What happened",
          "outcome": "You kept the garlands until they browned. A month later the temple asked you to keep its accounts, and you said yes before they finished asking.",
          "wellbeing": 6,
          "skills": {"eq": 1},
          "flag": "r_kharatchakan_5"
        }
      ]
      ,
      "rehearse": "Retired civil servants keep their medical cover. People with a public-sector pension do not receive the old-age allowance."
      }
    ]
  },
  {
    "route": "isan_daughter",
    "fit": {
      "classes": ["low_class", "working_class"],
      "sex": "female",
      "years": [1990, 2000]
    },
    "scenes": [
      {
        "id": "r_isan_daughter_1",
        "stage": 1,
        "min": 15,
        "max": 15,
        "category": "work",
        "title": "The first payslip",
        "prompt": "Your cousin has a bed for you in a room near a factory on the edge of Bangkok, and the line needs girls who can sit still. Your mother has packed sticky rice and dried fish in a plastic bag. Your teacher says you could finish M6.",
        "options": [
        {
          "id": "go",
          "label": "Take the night bus",
          "outcome": "The first payslip had a line you did not understand, five percent for social security. You sent half of the rest home.",
          "cash": 8000,
          "health": -2,
          "wellbeing": -3,
          "skills": {"drive": 2},
          "flag": "r_isan_daughter_1"
        },
        {
          "id": "school",
          "label": "Stay and finish school",
          "outcome": "You finished M6. There was less rice that year, and your brother left in your place.",
          "wellbeing": 1,
          "skills": {"iq": 2},
        }
      ]
      ,
      "rehearse": "A registered job puts you in Section 33: 5% of wages, matched by the employer. About half of Thai workers are informal and have no such line on a payslip."
      },
      {
        "id": "r_isan_daughter_2",
        "stage": 2,
        "min": 20,
        "max": 25,
        "category": "family",
        "title": "The baby on the bus",
        "prompt": "Your daughter is three months old. The room is two metres by three and the shift starts at six. Your mother says to bring her home: she raised four, she can raise one more.",
        "options": [
        {
          "id": "send",
          "label": "Take her to your mother",
          "outcome": "She learned to walk in the village and called your mother Mae. You saw her at Songkran and New Year, and sent money every month.",
          "cash": 5000,
          "wellbeing": -8,
          "skills": {"eq": 1},
          "flag": "r_isan_daughter_2"
        },
        {
          "id": "keep",
          "label": "Keep her in the room",
          "outcome": "A neighbour watched her while you worked. You were tired in a way you had not known existed.",
          "cash": -15000,
          "health": -3,
          "wellbeing": 3,
          "flag": "r_isan_daughter_2"
        }
      ]
      ,
      "rehearse": "Nearly 1 in 4 Thai children live with neither parent. In the Northeast it is 36% (UNICEF, 2019)."
      },
      {
        "id": "r_isan_daughter_3",
        "stage": 3,
        "min": 25,
        "max": 35,
        "category": "money",
        "title": "Four hundred baht and a form",
        "prompt": "The factory has closed and is not reopening. There is a form at the social security office. You can keep your cover if you pay it yourself, 432 baht a month, or you can stop.",
        "options": [
        {
          "id": "stop",
          "label": "Stop paying and go home",
          "outcome": "The money went on rice and your daughter's uniform. The months stopped counting at a hundred and forty.",
          "cash": 5000,
          "wellbeing": 1,
          "flag": "r_isan_daughter_3"
        },
        {
          "id": "keep",
          "label": "Keep paying it yourself",
          "outcome": "Nobody noticed. The months kept counting.",
          "cash": -5000,
          "wellbeing": -1,
          "skills": {"drive": 1},
          "flag": "r_isan_daughter_3"
        }
      ]
      ,
      "rehearse": "Section 39: 432 baht a month keeps your cover, if you apply within 6 months of leaving a job. The old-age pension needs 180 months of contributions."
      },
      {
        "id": "r_isan_daughter_4",
        "stage": 4,
        "min": 35,
        "max": 45,
        "category": "family",
        "title": "Your father's left hand",
        "prompt": "Your father's left hand stopped working on a Tuesday. Your brothers are in Rayong and Korea. Your mother calls every night and does not ask.",
        "options": [
        {
          "id": "brothers",
          "label": "Ask your brothers to come home",
          "outcome": "They sent money and said next year. Your mother stopped mentioning them.",
          "wellbeing": -5,
          "flag": "r_isan_daughter_4"
        },
        {
          "id": "home",
          "label": "Go home and nurse him",
          "outcome": "You fed him with a spoon for two years and opened a small shop on the porch. Your daughter came home from school to find you there.",
          "cash": -30000,
          "wellbeing": 2,
          "skills": {"eq": 3},
          "flag": "r_isan_daughter_4"
        },
        {
          "id": "pay",
          "label": "Send money for a neighbour to help",
          "outcome": "The neighbour was kind and the money arrived every month. You heard about the end on the phone.",
          "cash": -20000,
          "wellbeing": -6,
          "flag": "r_isan_daughter_4"
        }
      ]
      ,
      "rehearse": "Remittances and returning to care are how many Isan families cover illness and old age. No share is claimed here."
      },
      {
        "id": "r_isan_daughter_5",
        "stage": 5,
        "min": 55,
        "max": 55,
        "category": "money",
        "title": "A letter from Social Security",
        "prompt": "A letter from the social security office has your name typed correctly. It says what your pension will be each month for the rest of your life. Your granddaughter reads it to you twice.",
        "options": [
        {
          "id": "happened",
          "label": "What happened",
          "outcome": "It was not much. It came on the same day every month, and nobody could take it away.",
          "cash": 10000,
          "wellbeing": 5,
          "flag": "r_isan_daughter_5"
        }
      ]
      ,
      "rehearse": "Social security pays an old-age pension from 55: 20% of average earnings, plus 1.5% for each year beyond 15. At 60 the 600-baht allowance may be added, under the rules in force that year."
      }
    ]
  },
  {
    "route": "win_motorsai",
    "fit": {
      "classes": ["low_class", "working_class"],
      "sex": "male",
      "years": [1981, 2000]
    },
    "scenes": [
      {
        "id": "r_win_motorsai_1",
        "stage": 1,
        "min": 20,
        "max": 20,
        "category": "work",
        "title": "Red or black",
        "prompt": "The district office smells of floor polish and a thousand young men. Your father's knees have gone and your mother sells rice at the port gate. You can volunteer, draw a card from the jar, or file papers for supporting a parent, though the papers were due a month ago.",
        "options": [
        {
          "id": "draw",
          "label": "Put your hand in the jar",
          "outcome": "Red. Two years of rice and boots and a sergeant who called you by your village. Your mother counted the money you did not send.",
          "health": 2,
          "wellbeing": -3,
          "skills": {"physique": 2, "drive": 1},
          "flag": "r_win_motorsai_1"
        },
        {
          "id": "volunteer",
          "label": "Volunteer for the shorter term",
          "outcome": "You chose the date and the branch. It was still the army.",
          "wellbeing": -1,
          "skills": {"physique": 2},
          "flag": "r_win_motorsai_1"
        }
      ]
      ,
      "rehearse": "Selection is at 21 and service is up to two years. Deferment papers have a deadline before selection day, and evading selection is a crime."
      },
      {
        "id": "r_win_motorsai_2",
        "stage": 2,
        "min": 25,
        "max": 25,
        "category": "work",
        "title": "The orange vest",
        "prompt": "A man at the soi mouth is selling his place at the motorbike stand, vest and number and all. It is a year of savings plus what your uncle can lend. The stand has eleven riders and room for one more.",
        "options": [
        {
          "id": "factory",
          "label": "Take a job in a warehouse instead",
          "outcome": "A salary, a card, a supervisor. You missed the street, and your back did not.",
          "cash": 20000,
          "wellbeing": -2,
          "skills": {"craft": 1},
        },
        {
          "id": "buy",
          "label": "Buy the vest",
          "outcome": "You knew every gate in the soi by the second month. Nobody pays you on a day you do not ride.",
          "cash": -30000,
          "wellbeing": 2,
          "skills": {"craft": 1, "eq": 1},
          "flag": "r_win_motorsai_2"
        }
      ]
      ,
      "rehearse": "About half of Thai workers are informal: no salary, no sick pay and no employer paying in."
      },
      {
        "id": "r_win_motorsai_3",
        "stage": 3,
        "min": 30,
        "max": 30,
        "category": "money",
        "title": "Seventy baht",
        "prompt": "A woman from the district comes to the stand with a clipboard. Seventy baht a month, she says, and if you are sick or hurt the fund pays you for the days. The man beside you says he has never been sick.",
        "options": [
        {
          "id": "skip",
          "label": "Keep the seventy baht",
          "outcome": "It bought a lot of iced coffee over the years.",
          "cash": 4000,
          "flag": "r_win_motorsai_3"
        },
        {
          "id": "join",
          "label": "Sign up and pay the seventy baht",
          "outcome": "You forgot about it for six years.",
          "cash": -4000,
          "skills": {"drive": 1},
          "flag": "r_win_motorsai_3"
        }
      ]
      ,
      "rehearse": "Section 40 options: 70, 100 or 300 baht a month. Sickness pays per day, and only the 100 and 300 options add an old-age lump sum."
      },
      {
        "id": "r_win_motorsai_4",
        "era": [2020, 2021],
        "stage": 4,
        "min": 30,
        "max": 40,
        "category": "money",
        "title": "The man with the helmet",
        "prompt": "The city has closed and there are no fares. A man you know by his helmet lends by the day: a thousand now, a hundred and twenty back every evening for ten evenings. He knows which room you live in.",
        "options": [
        {
          "id": "borrow",
          "label": "Take the thousand",
          "outcome": "You paid on time for a month, then not. He came at dinner and did not raise his voice, which was worse.",
          "cash": 1000,
          "wellbeing": -10,
          "flag": "r_win_motorsai_4"
        },
        {
          "id": "temple",
          "label": "Queue at the temple for rice instead",
          "outcome": "You ate rice from the temple for six weeks and owed no one but the monks.",
          "health": -2,
          "wellbeing": -3,
          "skills": {"eq": 1},
          "flag": "r_win_motorsai_4"
        }
      ]
      ,
      "rehearse": "Lending above the legal rate (generally 15% a year) is a crime: up to 2 years or 200,000 baht. The lender still answers when banks do not."
      },
      {
        "id": "r_win_motorsai_5",
        "stage": 5,
        "min": 40,
        "max": 50,
        "category": "health",
        "title": "The soi mouth at dusk",
        "prompt": "A pickup turned without looking. You remember the sound and then the curb. The doctor says the leg will mend in three months, and you ride for a living.",
        "options": [
        {
          "id": "happened",
          "label": "What happened",
          "outcome": "The hospital cost nothing. The three months cost everything else.",
          "health": -14,
          "wellbeing": -10,
          "flag": "r_win_motorsai_5"
        }
      ]
      ,
      "rehearse": "Thailand's road deaths: 25.4 per 100,000 (WHO, 2021). The universal scheme pays for treatment. If you joined Section 40, claim the daily sickness benefit. Emergency: 1669."
      }
    ]
  },
  {
    "route": "rice_debt",
    "fit": {
      "classes": ["low_class", "working_class"],
      "sex": "male",
      "years": [1949, 1981]
    },
    "scenes": [
      {
        "id": "r_rice_debt_1",
        "stage": 1,
        "min": 20,
        "max": 20,
        "category": "family",
        "title": "The robes before the wedding",
        "prompt": "Your mother has saved for your ordination since you were born, in a tin behind the spirit shrine. Your girlfriend's father says the wedding should be after the harvest, and the harvest needs you.",
        "options": [
        {
          "id": "marry",
          "label": "Marry after the harvest",
          "outcome": "The harvest was good. Your mother kept the tin.",
          "cash": 6000,
          "wellbeing": -2,
          "flag": "r_rice_debt_1"
        },
        {
          "id": "ordain",
          "label": "Ordain for the rainy season",
          "outcome": "Your mother held the hem of your robe in the procession and cried the whole way round the hall. You learned to sit still.",
          "cash": -8000,
          "wellbeing": 6,
          "skills": {"eq": 2},
          "flag": "r_rice_debt_1"
        }
      ]
      ,
      "rehearse": "Ordination is a rite of merit for the parents."
      },
      {
        "id": "r_rice_debt_2",
        "stage": 2,
        "min": 25,
        "max": 40,
        "category": "health",
        "title": "The fever",
        "prompt": "Your son is hot and limp and the clinic in town says the hospital. Before the gold card you paid for every bed. After it you pay for the bus and the days you are not in the field.",
        "options": [
        {
          "id": "wait",
          "label": "Wait one more night",
          "outcome": "He was worse in the morning. He lived, and you never waited again.",
          "health": -2,
          "wellbeing": -8,
          "flag": "r_rice_debt_2"
        },
        {
          "id": "go",
          "label": "Take him now",
          "outcome": "He came home in a week. You lost the planting window by four days.",
          "cash": -12000,
          "wellbeing": -2,
          "skills": {"eq": 1},
          "flag": "r_rice_debt_2"
        }
      ]
      ,
      "rehearse": "The universal scheme covered about 47 million people from 2002, and the 30-baht copayment ended in 2006. Before it, a hospital bed was paid for out of pocket."
      },
      {
        "id": "r_rice_debt_3",
        "era": [2011, 2011],
        "stage": 3,
        "min": 35,
        "max": 50,
        "category": "money",
        "title": "The barrier at the city",
        "prompt": "The sandbags at the city held for three days and then they did not. The water is in the paddies at the height of the rice. The relief officer has a form and a queue, and the bank has a date.",
        "options": [
        {
          "id": "trader",
          "label": "Borrow from the rice trader",
          "outcome": "He was faster than the bank. He bought your next crop at his price.",
          "cash": 10000,
          "wellbeing": -8,
          "flag": "r_rice_debt_3"
        },
        {
          "id": "bank",
          "label": "Go to the bank and ask for time",
          "outcome": "They gave you a year and charged you for it.",
          "cash": -20000,
          "wellbeing": -6,
          "flag": "r_rice_debt_3"
        }
      ]
      ,
      "rehearse": "The 2011 floods affected more than 13 million people. The Bank for Agriculture is the main source of farm credit, and traders lend too."
      },
      {
        "id": "r_rice_debt_4",
        "stage": 4,
        "min": 45,
        "max": 55,
        "category": "money",
        "title": "The deed in the drawer",
        "prompt": "The debts are three now, and the man in town will take the land deed under a sale with the right to buy it back in two years. Your daughter in Bangkok says she can send more if you give her time.",
        "options": [
        {
          "id": "pledge",
          "label": "Sign the deed over",
          "outcome": "Two years went quickly. Your daughter sent what she could. It was not enough, and then it was not your land.",
          "cash": 60000,
          "wellbeing": -14,
          "flag": "r_rice_debt_4"
        },
        {
          "id": "sell",
          "label": "Sell half the land outright",
          "outcome": "You kept the half with the house and the mango trees. You worked it alone.",
          "cash": 90000,
          "wellbeing": -8,
          "flag": "r_rice_debt_4"
        }
      ]
      ,
      "rehearse": "Land is the last buffer, and once lost it rarely returns. No figure is claimed here."
      },
      {
        "id": "r_rice_debt_5",
        "era": [2008, 2100],
        "stage": 5,
        "min": 55,
        "max": 65,
        "category": "health",
        "title": "Three mornings a week",
        "prompt": "Your kidneys have stopped. The machine at the provincial hospital costs you nothing, three mornings a week, and the bus costs a morning each way. The woman in the next chair knits.",
        "options": [
        {
          "id": "happened",
          "label": "What happened",
          "outcome": "You learned her grandchildren's names. On the days your son could not drive you, you went alone.",
          "health": -14,
          "wellbeing": -8,
          "flag": "r_rice_debt_5"
        }
      ]
      ,
      "rehearse": "The universal scheme has paid for dialysis since 2008. 12.9% of older people lived alone in 2024."
      }
    ]
  },
  {
    "route": "no_buffer",
    "fit": {
      "classes": ["low_class"],
      "sex": null,
      "years": [1949, 1990]
    },
    "scenes": [
      {
        "id": "r_no_buffer_1",
        "stage": 1,
        "min": 15,
        "max": 15,
        "category": "family",
        "title": "After Yai",
        "prompt": "Your grandmother raised you, and she died on a Wednesday. Your mother has a room in Bangkok and a man you have met once. The headman says you can stay with a cousin and finish school, if the cousin agrees.",
        "options": [
        {
          "id": "city",
          "label": "Go to your mother in the city",
          "outcome": "You carried rice sacks in the market by October. Nobody asked about school.",
          "cash": 3000,
          "wellbeing": -8,
          "skills": {"physique": 2},
          "flag": "r_no_buffer_1"
        },
        {
          "id": "cousin",
          "label": "Ask the cousin",
          "outcome": "She said yes for a year, then her husband said no.",
          "wellbeing": -4,
          "skills": {"iq": 1},
          "flag": "r_no_buffer_1"
        }
      ]
      ,
      "rehearse": "Nearly 1 in 4 Thai children live with neither parent, and 39% in the poorest households (UNICEF, 2019)."
      },
      {
        "id": "r_no_buffer_2",
        "stage": 2,
        "min": 25,
        "max": 25,
        "category": "health",
        "title": "The motorbike or the hospital",
        "prompt": "The pain has been in your side for a month. The private clinic wants money first, and the motorbike is how you work.",
        "options": [
        {
          "id": "wait",
          "label": "Wait and work through it",
          "outcome": "It went quiet, and it came back worse two years later.",
          "health": -12,
          "wellbeing": -4,
          "flag": "r_no_buffer_2"
        },
        {
          "id": "sell",
          "label": "Sell the motorbike and pay",
          "outcome": "They fixed it. You walked to jobs for a year, and there were fewer jobs within walking distance.",
          "cash": -20000,
          "health": 4,
          "wellbeing": -6,
          "flag": "r_no_buffer_2"
        }
      ]
      ,
      "rehearse": "If your life is before 2002, this was paid out of pocket. Since the universal scheme, treatment is free and the costs are lost days and travel."
      },
      {
        "id": "r_no_buffer_3",
        "stage": 3,
        "min": 25,
        "max": 35,
        "category": "money",
        "title": "The daily man",
        "prompt": "The factory has closed, and the daily man lends a thousand at a hundred and twenty a day. Everyone in the building owes him something.",
        "options": [
        {
          "id": "borrow",
          "label": "Borrow",
          "outcome": "You paid the interest for a year and the principal never moved.",
          "cash": 1000,
          "wellbeing": -10,
          "flag": "r_no_buffer_3"
        },
        {
          "id": "no",
          "label": "Say no and go hungry for a while",
          "outcome": "You lost four kilos and kept the room.",
          "health": -4,
          "wellbeing": -4,
          "flag": "r_no_buffer_3"
        }
      ]
      ,
      "rehearse": "Above 15% a year is illegal. In a 2019 survey by the University of the Thai Chamber of Commerce, 40.8% of household debt was owed outside the banks."
      },
      {
        "id": "r_no_buffer_4",
        "era": [2011, 2011],
        "stage": 4,
        "min": 40,
        "max": 45,
        "category": "money",
        "title": "The water in the rented room",
        "prompt": "The water came up through the floor and stayed for five weeks. The rice cooker, the photographs and the papers are gone.",
        "options": [
        {
          "id": "happened",
          "label": "What happened",
          "outcome": "You started again with a bag and an ID card.",
          "wellbeing": -14,
          "flag": "r_no_buffer_4"
        }
      ]
      ,
      "rehearse": "The 2011 floods affected more than 13 million people."
      },
      {
        "id": "r_no_buffer_5",
        "stage": 5,
        "min": 60,
        "max": 65,
        "category": "family",
        "title": "Nobody to take you",
        "prompt": "The hospital is free, and the appointment is at eight. There is no one to take you. Your children's numbers ring and ring, and the 600 baht came on the tenth.",
        "options": [
        {
          "id": "ask",
          "label": "Ask the neighbour's boy",
          "outcome": "He took you on his motorbike and would not take money. You gave him a mango.",
          "wellbeing": 3,
          "skills": {"eq": 1},
          "flag": "r_no_buffer_5"
        },
        {
          "id": "stay",
          "label": "Stay home this time",
          "outcome": "You missed it, and the next one.",
          "health": -10,
          "wellbeing": -6,
          "flag": "r_no_buffer_5"
        }
      ]
      ,
      "rehearse": "The old-age allowance is 600 baht a month at 60 to 69. 12.9% of older people lived alone in 2024."
      }
    ]
  },
  {
    route:'courtyard',
    fit:{classes:['high_class'],sex:null,years:[1949,1975]},
    scenes:[
      {
        id:'r_courtyard_1',stage:1,min:20,max:25,category:'family',
        title:'Keys to the courtyard',
        prompt:'Your aunt hands you the keys to four rooms around a courtyard. A buyer offers cash for the whole property. Three households live there, and two have children at the school nearby.',
        options:[
          {id:'keep',label:'Keep the tenants and repair the rooms',outcome:'The repairs took most of the rent. Each family kept its front door.',wellbeing:2,skills:{eq:1,craft:1},flag:'r_courtyard_1'},
          {id:'sell',label:'Sell and give each household time to move',outcome:'You paid for the move. The children could stay at their school, but they stopped meeting in the courtyard.',cash:45000,wellbeing:-2,skills:{drive:1}}
        ]
      },
      {
        id:'r_courtyard_2',stage:2,min:35,max:50,category:'family',
        title:'A room to return to',
        prompt:'One of the children who grew up in the courtyard comes back with a parent who can no longer climb stairs. The only ground-floor room is where you keep your work.',
        options:[
          {id:'make_room',label:'Move your work upstairs',outcome:'Your work took longer on the stairs. On the ground floor, the parent could sit outside again.',wellbeing:3,skills:{eq:2},flag:'r_courtyard_2'},
          {id:'find_room',label:'Help them find a room nearby',outcome:'They found a room they could afford. The parent thanked you, and you saw them less often.',cash:-12000,wellbeing:-1,skills:{drive:1},flag:'r_courtyard_2'}
        ]
      }
    ]
  }
,{"route": "cadet", "fit": {"classes": ["low_class", "working_class", "middle_class", "bureaucratic_class"], "sex": "male", "years": [1949, 1975]}, "scenes": [{"id": "r_cadet_1", "stage": 1, "min": 20, "max": 20, "category": "work", "title": "Five in the morning, every morning", "prompt": "You passed the entrance exam for the army's officer academy. The first year is shouting, running before dawn, and seniors who decide what you are worth. A boy from your province is beaten most nights, and he has asked you to say nothing.", "options": [{"id": "quiet", "label": "Say nothing and finish the year", "outcome": "You both finished. You never spoke about it, and you stood beside him at his wedding.", "wellbeing": -3, "skills": {"physique": 2}, "flag": "r_cadet_1"}, {"id": "report", "label": "Tell an instructor", "outcome": "The beatings stopped. Your year stopped talking to you, and you graduated near the bottom of the list.", "wellbeing": -5, "skills": {"eq": 2}, "flag": "r_cadet_1"}, {"id": "leave", "label": "Leave the academy", "outcome": "You went home in the second term. Your father did not speak to you until Songkran.", "wellbeing": 2}], "rehearse": "Deaths of cadets during hazing have been reported in Thailand. If you are at risk, tell someone outside the chain of command."}, {"id": "r_cadet_2", "stage": 2, "min": 25, "max": 35, "category": "work", "title": "The long way round the hill", "prompt": "Your platoon holds a hill on the border. The radio says one thing and the villagers below say another. A patrol goes out at dawn, and the sergeant with the most years wants to take the long way.", "options": [{"id": "long", "label": "Take the long way", "outcome": "Nobody was hurt that month. Your captain wrote that you were slow.", "wellbeing": -2, "skills": {"eq": 1}, "flag": "r_cadet_2"}, {"id": "map", "label": "Take the road on the map", "outcome": "A mine took the lead man's foot. You wrote the letter to his mother yourself.", "wellbeing": -8, "health": -4, "skills": {"drive": 2}, "flag": "r_cadet_2"}], "rehearse": "From the 1960s to the early 1980s the army fought a communist insurgency in the north, northeast and south. From 1979 it guarded the Cambodian border through the Khmer Rouge war, and in 1987–88 Thailand and Laos fought a short border war at Ban Rom Klao."}, {"id": "r_cadet_3", "stage": 3, "min": 35, "max": 45, "category": "work", "title": "No paper with the order", "prompt": "Your commander rings at midnight. Your unit is to be at the bridges by four, and the order comes with no paper. Your family's forms for the new school year are on the kitchen table.", "options": [{"id": "go", "label": "Take the unit to the bridges", "outcome": "By morning the television showed only music. You were promoted two years early, and the promotion came with a house.", "cash": 80000, "wellbeing": -4, "flag": "r_cadet_3"}, {"id": "sick", "label": "Report sick", "outcome": "Your name went to the bottom of a list you could not see. You retired a colonel and slept well.", "wellbeing": 3}], "era": [[1991, 1991], [2006, 2006], [2014, 2014]], "rehearse": "Thailand has had more than a dozen coups and attempts since 1932. The coups of 1991, 2006 and 2014 were led from the army's top ranks."}, {"id": "r_cadet_4", "stage": 4, "min": 45, "max": 60, "category": "work", "title": "A chair with a flag on the car", "prompt": "The men who took power have formed a council, and they want a soldier who can talk to farmers and to bankers. The chair comes with a car, a flag on the car, and a vote you will be expected to cast as told.", "options": [{"id": "sit", "label": "Take the seat", "outcome": "You learned to read a budget and to smile at cameras. Your old platoon sent a wreath when your mother died, with every name spelled right.", "cash": 120000, "wellbeing": -2, "flag": "r_cadet_4"}, {"id": "farm", "label": "Retire to the orchard", "outcome": "You grew durian badly and happily. People still saluted you at the market.", "wellbeing": 6}], "era": [[2006, 2008], [2014, 2019]], "rehearse": "After the 2006 and 2014 coups, serving and retired officers held many of the seats in the appointed legislatures and cabinets."}, {"id": "r_cadet_5", "stage": 5, "min": 55, "max": 65, "category": "work", "title": "They ask you to lead", "prompt": "The council has run out of civilians it trusts. A delegation in white uniforms waits in your sitting room to ask whether you will lead the government until the next election, whenever that is.", "options": [{"id": "accept", "label": "Accept", "outcome": "You signed more orders in a year than in thirty years of service. Every morning the newspapers had a cartoon of your face.", "wellbeing": -4, "skills": {"drive": 2}, "flag": "r_cadet_5"}, {"id": "decline", "label": "Decline", "outcome": "Someone else accepted. You watched him on television and did not envy him.", "wellbeing": 4, "flag": "r_cadet_5"}], "era": [[2006, 2008], [2014, 2019]], "rehearse": "Many of Thailand's prime ministers since 1932 have been generals."}]},
{"route": "tycoon", "fit": {"classes": ["working_class", "middle_class", "bureaucratic_class"], "sex": "male", "years": [1949, 1970]}, "scenes": [{"id": "r_tycoon_1", "stage": 1, "min": 20, "max": 20, "category": "work", "title": "Top of the class goes abroad", "prompt": "The police cadet school has taken you, and the top of the class is sent abroad to study. Your mother borrowed for the uniform.", "options": [{"id": "top", "label": "Study to be first", "outcome": "You were first. The scholarship letter came with a seal on it, and you flew in a suit that did not fit.", "wellbeing": -2, "skills": {"iq": 2, "drive": 1}, "flag": "r_tycoon_1"}, {"id": "enjoy", "label": "Enjoy being a cadet", "outcome": "You graduated in the middle and were posted to a station on the edge of the city.", "wellbeing": 3}]}, {"id": "r_tycoon_2", "stage": 2, "min": 25, "max": 35, "category": "money", "title": "Selling to your own department", "prompt": "Back from your studies, you find the department still types every record by hand. A friend has a company that leases computers, and you know exactly who signs the orders.", "options": [{"id": "sell", "label": "Leave the force and sell", "outcome": "The first contract paid for your house. The second paid for your friend's.", "cash": 150000, "wellbeing": 2, "skills": {"drive": 2}, "flag": "r_tycoon_2"}, {"id": "stay", "label": "Stay a policeman", "outcome": "You were a good investigator. The man who took your friend's offer got rich, and you were glad for him most days.", "wellbeing": 1}], "rehearse": "Officials are barred from holding an interest in contracts with their own agency. Read the conflict-of-interest rules before you sign anything."}, {"id": "r_tycoon_3", "stage": 3, "min": 35, "max": 45, "category": "money", "title": "A licence for the air", "prompt": "The state is handing out concessions to run the new pagers and mobile phones, each one a monopoly for years. A man who knows a minister says the price of yours is not in the tender documents.", "options": [{"id": "pay", "label": "Pay what is asked", "outcome": "You won the licence. For a decade your company's name was on half the phones in the country.", "cash": 600000, "wellbeing": -6, "flag": "r_tycoon_3"}, {"id": "clean", "label": "Bid clean", "outcome": "You lost. The winner's phones were everywhere, and your engineers went to work for him.", "cash": -60000, "wellbeing": 2}], "era": [[1987, 1996]], "rehearse": "In the late 1980s and 1990s the state gave private firms long concessions to run telephone and mobile services, sharing revenue with state agencies."}, {"id": "r_tycoon_4", "stage": 4, "min": 40, "max": 55, "category": "connection", "title": "Your own party", "prompt": "The baht has fallen and the old parties look tired. Your money could start a new one, with a slogan a farmer would understand.", "options": [{"id": "found", "label": "Found the party", "outcome": "The party won. You became prime minister on a Tuesday and were learning the job by Friday.", "cash": -150000, "wellbeing": 4, "skills": {"eq": 2}, "flag": "r_tycoon_4"}, {"id": "fund", "label": "Stay in business and fund every side", "outcome": "It was cheaper than running. Every government for twenty years returned your calls.", "cash": 100000, "wellbeing": -2}], "era": [[1998, 2001]], "rehearse": "The 1997 constitution changed how parties and elections worked. In 2001 a party founded three years earlier won the general election."}, {"id": "r_tycoon_5", "stage": 5, "min": 55, "max": 65, "category": "family", "title": "Tanks while you are away", "prompt": "You are abroad for a meeting when the army takes power at home. Your lawyers ring before your ministers do.", "options": [{"id": "home", "label": "Fly home and face the courts", "outcome": "You came home. The cases took years, and the photographers waited outside every one.", "cash": -200000, "wellbeing": -8, "flag": "r_tycoon_5"}, {"id": "away", "label": "Stay abroad", "outcome": "You stayed away for fifteen years. You spoke to your supporters by video and missed every funeral.", "wellbeing": -12, "flag": "r_tycoon_5"}], "era": [[2006, 2006]], "rehearse": "In September 2006 the army took power while the prime minister was abroad."}]},
{"route": "far_scholar", "fit": {"classes": ["working_class", "middle_class", "bureaucratic_class"], "sex": null, "years": [1975, 1990]}, "scenes": [{"id": "r_far_scholar_1", "stage": 1, "min": 20, "max": 20, "category": "work", "title": "After the last bus", "prompt": "Your marks got you into a university on the edge of the city, two buses from anywhere. A senior runs a design club that meets after the last bus has gone.", "options": [{"id": "club", "label": "Join the club and sleep at the studio", "outcome": "You learned to draw cities before you had seen one. Your parents saw you at Songkran.", "wellbeing": 1, "skills": {"craft": 2, "iq": 1}, "flag": "r_far_scholar_1"}, {"id": "bus", "label": "Go home on the last bus", "outcome": "You finished on time with good marks. You never stayed up for anything.", "wellbeing": 2}]}, {"id": "r_far_scholar_2", "stage": 2, "min": 25, "max": 25, "category": "work", "title": "Two offers in one week", "prompt": "Offers from a university in Massachusetts and one in England arrive in the same week. A government scholarship would pay, and you would owe the state years of service when you come back.", "options": [{"id": "ma", "label": "Go to Massachusetts", "outcome": "The first winter you bought the wrong coat. By spring you were teaching the class you had failed in the autumn.", "wellbeing": 2, "skills": {"iq": 3}, "flag": "r_far_scholar_2"}, {"id": "uk", "label": "Go to England", "outcome": "Everyone dressed for dinner. You learned to argue in a voice you did not have at home.", "wellbeing": 1, "skills": {"iq": 2, "eq": 1}, "flag": "r_far_scholar_2"}, {"id": "stay", "label": "Stay and start work", "outcome": "You were promoted twice before your friends came back with their degrees. Then they were your bosses.", "cash": 30000}], "rehearse": "Government scholarships commonly ask for twice the funded years in service. Read the bond before you sign it."}, {"id": "r_far_scholar_3", "stage": 3, "min": 30, "max": 35, "category": "work", "title": "Three years, and none of them home", "prompt": "A research post wants you in Europe, a city government in Asia wants you for its data, and your mother wants you home. Each job is three years.", "options": [{"id": "asia", "label": "Take the city in Asia", "outcome": "You learned to judge a city by how often its trains came. Your Thai began to sound like an announcement.", "cash": 60000, "wellbeing": -2, "skills": {"craft": 1, "drive": 1}, "flag": "r_far_scholar_3"}, {"id": "europe", "label": "Take the post in Europe", "outcome": "You wrote papers that eleven people read, and three of them changed how a city counted its buses.", "cash": 20000, "wellbeing": 1, "skills": {"iq": 2}, "flag": "r_far_scholar_3"}, {"id": "home", "label": "Go home to your mother", "outcome": "She was proud for a week and then asked when you would marry.", "wellbeing": 3, "flag": "r_far_scholar_3"}]}, {"id": "r_far_scholar_4", "stage": 4, "min": 40, "max": 45, "category": "work", "title": "Nobody at the ministry knows your name", "prompt": "You are back in Bangkok with a passport full of stamps, and nobody at the ministry remembers you. A young official asks you to explain a city the way you explained it abroad.", "options": [{"id": "build", "label": "Build it here", "outcome": "It took years to be heard. Then one province used your measure, and then nine.", "cash": -20000, "wellbeing": 5, "skills": {"eq": 2}, "flag": "r_far_scholar_4"}, {"id": "leave", "label": "Go back abroad", "outcome": "You kept a flat in Bangkok and slept in it three nights a year.", "cash": 80000, "wellbeing": -4}]}, {"id": "r_far_scholar_5", "stage": 5, "min": 50, "max": 55, "category": "connection", "title": "The same man in three cities", "prompt": "One evening you notice that the man selling you coffee is the man who sold you coffee in Massachusetts, and in the Asian city, and outside your school when you were ten. He smiles as if you had finally noticed.", "options": [{"id": "happened", "label": "What happened", "outcome": "You laughed, paid, and walked on. After that you looked more carefully at the people in the background.", "wellbeing": 4, "flag": "r_far_scholar_5"}]}]}
];
export const BLOG_SCENES=[{"id":"n1_expert","min":30,"max":40,"category":"work","title":"Everyone thinks you know","prompt":"You moved back to a city you have written about for years. In your first week a colleague asks you to name a decent place for lunch and you cannot. Two other people are waiting for your answer.","options":[{"id":"ask","label":"Admit you do not know it, ask a local","outcome":"A woman from the next desk took you to a stall behind the market. People stopped asking you for restaurants and started asking you along.","wellbeing":2,"skills":{"eq":2}},{"id":"bluff","label":"Name a place from six years ago","outcome":"It had become a phone shop. The story went round the office by Friday.","wellbeing":-3,"skills":{"eq":1}},{"id":"walk","label":"Refuse all requests for a year and walk it yourself","outcome":"You were lost most weekends and took taxis home from the worst of it. By December you could draw the city from memory.","cash":-3000,"health":2,"wellbeing":1,"skills":{"iq":1}}]},{"id":"n1_kettle","min":20,"max":30,"category":"connection","title":"The kettle at home","prompt":"Every friend you have proposes the same cafe and the same sweet drink, left half full. You own a kettle, two cups and a spare room. Nobody has asked what you could do at home.","options":[{"id":"home","label":"Invite them home and make the tea yourself","outcome":"Four came the first time and two the second. The two stayed past midnight and the cups were not washed until morning.","wellbeing":4,"skills":{"eq":2}},{"id":"cafe","label":"Go to the cafe like everyone else","outcome":"You paid for four drinks and drank one. The conversation fit inside the opening hours.","cash":-800,"wellbeing":-1},{"id":"both","label":"Home for close friends, cafe for the rest","outcome":"You ran two circles and a second kettle. It was more work and neither group minded.","cash":-400,"wellbeing":2,"skills":{"eq":1}}]},{"id":"n1_horn","min":25,"max":45,"category":"connection","title":"The horn behind you","prompt":"A driver leans on his horn behind you at a red light, with nothing in front of you but the light. You have been honked at forty times this week. This is the first time you can reach his window.","options":[{"id":"ask","label":"Knock and ask him what the matter is","outcome":"He rolled the window down, lit a cigarette and said it was only a horn. You rode off feeling slightly foolish and somewhat lighter.","wellbeing":1,"skills":{"eq":2}},{"id":"ignore","label":"Ignore it and keep riding","outcome":"The sound stayed with you to the next junction, and the one after that.","health":-1,"wellbeing":-2},{"id":"shout","label":"Shout back","outcome":"You won the exchange. The light changed, and you lost the rest of the afternoon to it.","health":-1,"wellbeing":-3}]},{"id":"n1_lamp","min":20,"max":40,"category":"health","title":"One in the morning","prompt":"You rent a cheap old room alone while you work. It is one in the morning, the stairwell outside is dark and the room is very hot. The door could stay open for the air.","options":[{"id":"lock","label":"Lock the door and work under the lamp","outcome":"You finished eleven pages by three. You slept badly and the pages were good.","health":-2,"skills":{"craft":2}},{"id":"open","label":"Leave it open for the breeze","outcome":"The air was a relief. At four you woke to footsteps on the stairs that turned out to be a neighbour going to work.","health":-1,"wellbeing":-3},{"id":"move","label":"Pay more for a room with a guard","outcome":"The room was cooler and the rent was higher. The quiet that made the work possible did not come with it.","cash":-6000,"health":1,"wellbeing":1}]},{"id":"n1_poll","min":25,"max":60,"category":"work","title":"The poll","prompt":"A newspaper asked readers whether a pilots' union was overworked, and half answered that they did not know. Your boss wants to put the percentages in Friday's report. You have until four to say something.","options":[{"id":"quote","label":"Quote it with a footnote in small print","outcome":"The report went out on time. Nobody read the footnote, including you a week later.","wellbeing":-2},{"id":"rewrite","label":"Say the number is useless and rewrite the question","outcome":"You lost Thursday night and gained a boss who sighed. The new question was whether passengers still trusted the airline, and its answers were readable.","health":-1,"wellbeing":1,"skills":{"iq":2}},{"id":"drop","label":"Drop the poll and use only what you can check","outcome":"The report was two pages thinner. Every number in it could be traced to a source.","skills":{"iq":1}}]},{"id":"n1_bike","min":30,"max":40,"category":"money","title":"The good bicycle","prompt":"You have wanted a folding bicycle with a proper hinge for years. It costs three times the cheap one. A parent of yours wanted exactly this model and never bought it.","options":[{"id":"wait","label":"Wait another year and decide again","outcome":"The want stayed where it was. By spring you had stopped checking the price.","health":-1,"wellbeing":-1},{"id":"cheap","label":"Buy the cheap one","outcome":"It rattled from the second week and you replaced it in the third year.","cash":-7000,"wellbeing":-1},{"id":"good","label":"Buy the good one and ride it hard","outcome":"You rode it every day for fifteen years, and every spring the hinge still clicked the same way.","cash":-22000,"health":2,"wellbeing":3,"skills":{"physique":1}}]},{"id":"n1_project","min":25,"max":35,"category":"work","title":"Three colleagues say no","prompt":"Three colleagues tell you not to start the long personal project you keep describing at lunch. It will not help your career, they say, and your thesis is already late. You have a blank notebook and an evening.","options":[{"id":"page","label":"Write one page a night and tell nobody","outcome":"By June there were ninety pages. The thesis slowed by a month and you knew what you thought for the first time.","wellbeing":2,"skills":{"craft":1,"drive":1}},{"id":"shelf","label":"Shelve it until the thesis is finished","outcome":"The thesis was finished in March. The notebook was still blank.","wellbeing":-2},{"id":"open","label":"Start it and ask for comments","outcome":"Two of the three read it. One said the third chapter was the first honest thing you had written.","skills":{"eq":1,"craft":1}}]},{"id":"n1_flight","min":30,"max":50,"category":"health","title":"Night flight","prompt":"A night flight after a long week. As the plane leaves the ground you picture it going down, and find you would be calm about it. The seat belt sign goes off.","options":[{"id":"list","label":"Write down what you would still want to do","outcome":"The list ran to six items and two could be done within a week. You did one of them.","wellbeing":2,"skills":{"drive":1}},{"id":"film","label":"Watch a film and have a drink","outcome":"You landed rested, and the thought did not come back that month.","cash":-400},{"id":"cancel","label":"Cancel the next three trips","outcome":"You were home for three Fridays running. A client in another city gave the contract to someone who was not.","cash":-15000,"health":1,"wellbeing":3}]},{"id":"n1_dinner","min":30,"max":45,"category":"connection","title":"The sweetheart question","prompt":"At a dinner a stranger tells the table he married his school sweetheart and has three children. Everyone turns to you. The question is the usual one.","options":[{"id":"single","label":"Say you are single and content","outcome":"It came out true and your stomach turned over anyway. The man asked about your work and you talked for an hour.","skills":{"eq":1}},{"id":"busy","label":"Give a long and busy answer","outcome":"You explained too much and left with the feeling of having signed something.","wellbeing":-2},{"id":"ask","label":"Ask him about the sweetheart","outcome":"You heard about a bicycle, a bus pass and a letter he had kept for twenty years. Nobody asked you again that night.","wellbeing":2,"skills":{"eq":2}}]},{"id":"n1_tech","min":15,"max":20,"category":"family","title":"Home after the crash","prompt":"The baht fell and your family can no longer pay for the school abroad. Within a month you are at a technical college where most of the class does things because everyone does. When you ask why, nobody has an answer.","options":[{"id":"teacher","label":"Find the one teacher who answers questions","outcome":"He gave you his lunch hours for two years. The class decided you were the teacher's favourite.","wellbeing":1,"skills":{"iq":2}},{"id":"fit","label":"Try hard to fit in","outcome":"You learned the songs and the rounds. By the end of the first term you were tired from acting and still the new boy.","cash":-4000,"health":-2,"wellbeing":-4},{"id":"refuse","label":"Refuse everything that comes without a reason","outcome":"You kept two friends in four years. The rest of the class stopped telling you where the exams were held.","wellbeing":-3,"skills":{"iq":2}}],"years":[1997,1999]},{"id":"n1_library","min":15,"max":20,"category":"work","title":"The library closes at eight","prompt":"A teacher takes you aside and tells you to drink and smoke with the others and to study less, or you will have no friends and no future in the trade. The library closes at eight and has air conditioning. The steps outside are full.","options":[{"id":"read","label":"Spend every evening in the library","outcome":"You read about a thousand books in four years. You made one friend, a librarian who let you borrow more than the limit.","wellbeing":-1,"skills":{"iq":3}},{"id":"steps","label":"Join the group on the steps at night","outcome":"You had company, a cough and a notebook that stayed shut.","cash":-6000,"health":-4,"wellbeing":2,"skills":{"eq":1}},{"id":"both","label":"Two nights each","outcome":"Both groups found you slightly false. Both kept a seat for you.","wellbeing":-1,"skills":{"eq":1,"iq":1}}],"years":[1998,2002]},{"id":"n1_funeral","min":30,"max":40,"category":"connection","title":"Said at a funeral","prompt":"At a funeral an old friend takes you aside and tells you your life looks poor: no money, no career, few friends. She says it kindly. You had never put it that way yourself.","options":[{"id":"agree","label":"Agree and say what you are working on","outcome":"She left unconvinced and you drove home with the windows down.","wellbeing":1,"skills":{"eq":2}},{"id":"figures","label":"Answer with figures","outcome":"You won the argument. She did not call at New Year.","wellbeing":-3},{"id":"silent","label":"Say nothing and go home","outcome":"The sentence rode home with you. It was still there on your fortieth birthday.","wellbeing":-4}]},{"id":"n1_marry","min":30,"max":45,"category":"family","title":"New Year and the question","prompt":"At every New Year an aunt asks when you will marry and have a child. You have thought about it for years and would rather not bring a person into a world you do not yet understand. The bowls are being passed.","options":[{"id":"plain","label":"Tell her plainly, and why","outcome":"The table went quiet. Two elders stopped calling for a season, and one of them came by at Songkran with a bag of mangoes.","wellbeing":1,"skills":{"eq":1}},{"id":"notyet","label":"Say not yet","outcome":"She was pleased. The question was back the next year with a date attached.","wellbeing":-2},{"id":"subject","label":"Change the subject and carry on living","outcome":"The subject changed. The small lie travelled with you for twenty more New Years.","wellbeing":-1}]},{"id":"n1_wfh","min":35,"max":45,"category":"health","title":"Working from home","prompt":"You have worked from home for a year. You skip the office lunches and the beers, walk fast every evening at five and have lost a good deal of weight. A colleague says you are becoming strange.","options":[{"id":"keep","label":"Keep the routine","outcome":"Six months later your trousers were two sizes down and your Friday invitations were fewer.","health":4,"wellbeing":1,"skills":{"physique":1}},{"id":"lunch","label":"Go back to the office lunches","outcome":"The food was worse and the company was good. You gained back some of what you had lost.","cash":-800,"health":-2,"wellbeing":1,"skills":{"eq":1}},{"id":"one","label":"Pick one lunch a week","outcome":"It suited nobody entirely and everybody a little.","cash":-200,"health":1,"skills":{"eq":1}}],"years":[2020,2022]},{"id":"n1_quotes","min":25,"max":40,"category":"work","title":"You quote too much","prompt":"Several people tell you that you quote other writers too often when you explain what you do. One says you have no voice of your own. You are about to answer in a meeting.","options":[{"id":"keep","label":"Keep quoting, and say why","outcome":"You said you were borrowing tools, not a personality. They did not believe you but they stopped bringing it up.","skills":{"iq":1}},{"id":"cut","label":"Cut the quotes and say it plainly","outcome":"Your sentences got shorter. People started disagreeing with you directly, which was an improvement.","wellbeing":1,"skills":{"craft":2}},{"id":"ask","label":"Ask what they think is missing","outcome":"It took an hour. Two of the answers stung and one was right.","skills":{"eq":2}}]},{"id":"n1_last_post","min":25,"max":45,"category":"work","title":"The post about a colleague","prompt":"After a bad meeting you are typing a post about a colleague, and it is good. Before you press the key you ask yourself whether you would be at peace if it were the last thing you ever wrote. The cursor is still blinking.","options":[{"id":"delete","label":"Delete it and write to a friend instead","outcome":"The friend read it twice and said you were tired. She was right.","wellbeing":2,"skills":{"eq":1}},{"id":"short","label":"Post a short version without names","outcome":"Eleven people liked it. The colleague heard of it by lunch.","wellbeing":-1},{"id":"full","label":"Post it as written","outcome":"It got forty likes and a formal meeting. The meeting took most of the next month.","cash":-3000,"wellbeing":-4}]},{"id":"n1_envelope","min":30,"max":45,"category":"money","title":"The envelope","prompt":"A client sends a small envelope with the contract, the kind that makes a year easy. A parent of yours spent forty years in a government office with a worn flask of tea and never took one. Nobody is watching.","options":[{"id":"return","label":"Return it with a note","outcome":"The client was embarrassed for a week and then gave you the next contract anyway.","wellbeing":1},{"id":"keep","label":"Keep it, once","outcome":"It bought a year of ease. The next envelope arrived without a contract attached.","cash":25000,"wellbeing":-3},{"id":"give","label":"Keep it and give it away","outcome":"You gave most of it to a temple fund. You noticed afterwards that you had broken the rule and renamed it.","cash":5000,"wellbeing":-1}]},{"id":"n1_cousin","min":35,"max":50,"category":"family","title":"Cards with a small cousin","prompt":"Your young cousin is the youngest in a house of doting adults, and she has learned that the rules can change when she is losing. You are there for two nights. She asks you to play a card game.","options":[{"id":"fair","label":"Play fair, lose in front of her, stay kind","outcome":"She sulked for ten minutes and then dealt again. The second game she kept the rules.","wellbeing":1,"skills":{"eq":2}},{"id":"let","label":"Let her win","outcome":"She won six games and enjoyed none of them."},{"id":"adults","label":"Speak to the adults over dinner","outcome":"Your aunt cleared the plates in silence. You were not asked back for the next holiday.","wellbeing":-2}]},{"id":"n1_tyre","min":30,"max":40,"category":"money","title":"The flat tyre","prompt":"Your bicycle has a flat that will not hold air. The shop wants to sell you a new inner tube. A young technician in the back looks at the wheel and says it is only a crack he can patch.","options":[{"id":"patch","label":"Let him patch it and thank him","outcome":"He took the wheel apart on a tray, in order, and put it back in the same order. The patch held for four years.","wellbeing":2,"skills":{"craft":1,"eq":1}},{"id":"buy","label":"Buy the new tube","outcome":"The shop earned more and you learned nothing about the wheel.","cash":-900},{"id":"home","label":"Do it yourself at home","outcome":"It took two hours and a shirt. By the end you knew where every part went.","cash":-300,"skills":{"craft":2}}]},{"id":"n1_scholarship","min":20,"max":35,"category":"money","title":"The scholarship letter","prompt":"Your grades are low enough to cost you the scholarship, and a letter says so. A meeting with your sponsors is on the calendar for the same week, in another city. The train leaves at six.","options":[{"id":"truth","label":"Take the train and tell them the truth","outcome":"They looked sad for about a minute and then asked what would help. The scholarship stayed, with a condition.","wellbeing":-2,"skills":{"eq":2}},{"id":"cram","label":"Stay and cram","outcome":"Your marks rose a little. The sponsors found out in the spring, from someone else.","health":-2,"wellbeing":-3,"skills":{"iq":2}},{"id":"silent","label":"Take the train and say nothing","outcome":"It was a pleasant ride. The thread was still hanging when you got home.","cash":-1200,"wellbeing":-1}]},{"id":"n1_photo","min":25,"max":45,"category":"connection","title":"Delete that one","prompt":"A friend asks you to delete a photograph you took of her, because she does not like her face in it. You think it is the best picture you have taken this year. Her thumb is already on the screen.","options":[{"id":"delete","label":"Delete it and say sorry","outcome":"You lost the picture and kept the friend. You remembered the light for a long time.","wellbeing":-1,"skills":{"eq":2}},{"id":"explain","label":"Keep it and explain why it matters to you","outcome":"She was hurt. She stopped coming along when you brought the camera.","wellbeing":-2},{"id":"stop","label":"Keep it and stop photographing friends","outcome":"You still took bridges, stairs and rooftops. The albums got emptier of faces.","wellbeing":-3}]},{"id":"n1_car_door","min":30,"max":40,"category":"health","title":"One second","prompt":"A video in your feed shows a stranger killed in one second by an open car door. You had assumed everyone gets time to say something. Your phone is still lit.","options":[{"id":"call","label":"Call someone you love tonight","outcome":"It was ten awkward minutes about nothing. Your mother asked if you were ill.","wellbeing":2,"skills":{"eq":1}},{"id":"close","label":"Close it and move on","outcome":"It came back at two in the morning, along with the door.","wellbeing":-2},{"id":"paper","label":"Write down your wishes and where the papers are","outcome":"It took an evening, a folder and a stamp from the district office. You told one person where the folder was.","cash":-500,"wellbeing":1}]},{"id":"n1_stable_job","min":40,"max":60,"category":"work","title":"The stable job","prompt":"You have watched older people save all their freedom for retirement and find it smaller than advertised. This week a stable job you dislike is offered to you on the same terms. The pay is very good.","options":[{"id":"decline","label":"Decline, and take poorly paid work you like","outcome":"The pay was a third. You took the bus, and no Monday felt like a Sunday night.","wellbeing":3,"skills":{"craft":1}},{"id":"five","label":"Take it and plan to leave in five years","outcome":"You saved well. The five years had a way of becoming eight.","cash":40000,"health":-2,"wellbeing":-4},{"id":"half","label":"Take it part time","outcome":"Half the money, half the Sunday dread, and a manager who watched the clock for you.","cash":18000}]},{"id":"n1_eldercare","min":35,"max":50,"category":"work","title":"Old age as a slide","prompt":"At a conference on elder care a speaker calls old age a failure of productivity. Slides follow. You are thirty-three and have been told you look older than you are.","options":[{"id":"say","label":"Say you like looking older, and why","outcome":"Two people laughed. One came up afterwards and said her father would have liked you.","wellbeing":1,"skills":{"eq":1}},{"id":"nod","label":"Nod along","outcome":"You felt faintly ashamed on the way to the lift.","wellbeing":-2},{"id":"walk","label":"Leave and walk","outcome":"You missed the coffee break and two sessions, and found a bench by the canal.","cash":-300,"health":1,"wellbeing":1}],"years":[1996,2040]},{"id":"n1_loan","min":20,"max":30,"category":"money","title":"Loan to skip waiting","prompt":"Interest is low and the bank is happy to lend. A loan would let you skip the waiting years your friends are serving. The form is two pages.","options":[{"id":"wait","label":"Wait and work the dull job first","outcome":"You were two years behind everyone you knew. The bank's letters of 2008 went to other people.","wellbeing":-2,"skills":{"drive":1}},{"id":"half","label":"Borrow half and live small","outcome":"It was a slower plan. When the numbers turned, it was a survivable one.","cash":15000},{"id":"full","label":"Take the full loan and start now","outcome":"The first year was marvellous. In 2008 the debt tripled and it took five years to pay.","cash":30000,"health":-2,"wellbeing":-5}],"years":[2006,2008]},{"id":"n1_trip","min":25,"max":35,"category":"family","title":"The long trip","prompt":"You are saving to take a parent on the long trip they have talked about for years. A job offer arrives that will double your pay and eat your holidays. The trip is booked for March.","options":[{"id":"promise","label":"Take the job and promise the trip for next year","outcome":"Next year had an offer of its own.","cash":12000,"wellbeing":-2},{"id":"trip","label":"Take the trip first, with what you have","outcome":"It was a modest trip with three changes of train. Your mother talked to strangers all the way and slept soundly in every hotel.","cash":-20000,"wellbeing":6},{"id":"gift","label":"Take the job and send money instead","outcome":"The money arrived on time. You did not.","cash":8000,"wellbeing":-3}]},{"id":"n1_grandparent","min":25,"max":30,"category":"family","title":"A fare costs a month","prompt":"A grandparent is unwell the week you are due to leave to study in another country. Your parents say not to come back, and to keep going. A fare costs a month of food.","options":[{"id":"letter","label":"Stay abroad and write a long letter","outcome":"You missed the funeral and kept the place. The letter was read aloud at the house and you were not there to hear it.","wellbeing":-4,"skills":{"iq":1}},{"id":"fly","label":"Fly home for the weekend","outcome":"You ate noodles from the shop at the airport for a month. You were in the room.","cash":-15000,"wellbeing":1},{"id":"defer","label":"Defer a term","outcome":"Your timetable slipped. The scholarship office wrote twice.","cash":-8000}],"years":[2008,2010]},{"id":"n1_word","min":25,"max":35,"category":"family","title":"The word at lunch","prompt":"In your late twenties the neighbours have a word for people your age who are still single. A cousin says it at lunch, loudly, in front of you. The aunt is waiting to see what you do.","options":[{"id":"joke","label":"Answer with a joke and keep eating","outcome":"The table laughed and the aunt made a note somewhere.","wellbeing":1,"skills":{"eq":1}},{"id":"plans","label":"Say you have other plans for the decade","outcome":"There was a silence. One cousin sent you a message that night saying she had thought the same.","wellbeing":1},{"id":"date","label":"Start dating to stop the talk","outcome":"A year of dinners nobody wanted. The word went quiet and you did not notice the day it stopped.","cash":-6000,"wellbeing":-4}]},{"id":"n1_grading","min":30,"max":50,"category":"work","title":"Forty exam papers","prompt":"Forty exam papers, four pages each. Your colleagues give each one three minutes and a grade. You are on the ninth, at seven in the evening, and nobody will check.","options":[{"id":"three","label":"Give each three minutes, like the others","outcome":"You were at the bar by half past seven. You knew nothing about the class you had taught that term.","wellbeing":1},{"id":"full","label":"Read each properly and write comments","outcome":"It took forty hours. Eleven students wrote the next essay differently, and one thanked you in an email of three words.","health":-2,"wellbeing":-3,"skills":{"craft":2,"iq":1}},{"id":"half","label":"Read all of them, comment on the ones returned","outcome":"You read forty and wrote on twenty-two. The other eighteen sat in a box until the term ended.","wellbeing":-1,"skills":{"iq":1}}],"years":[1998,2040]},{"id":"n1_no_time","min":30,"max":45,"category":"work","title":"No time","prompt":"A colleague who has lived abroad for nearly ten years still cannot order lunch in the local language. He says he has no time. You are about to lend him a ten-minute podcast.","options":[{"id":"lend","label":"Lend it and let him decline","outcome":"He said he would listen at the weekend. The weekend had a football match.","skills":{"eq":1}},{"id":"teach","label":"Teach him five phrases at lunch","outcome":"He used four of them by Friday and got the price of a bowl of noodles wrong with great confidence.","wellbeing":1,"skills":{"eq":2}},{"id":"stop","label":"Stop offering and stop eating together","outcome":"Lunch became half an hour quieter and half an hour longer.","wellbeing":1}],"years":[2012,2040]},{"id":"n1_panel","min":30,"max":45,"category":"work","title":"The panel","prompt":"A visiting colleague is speaking confidently on a panel about a subject he has visited twice. You have spent years on it and he is wrong about two things. The chair asks if anyone has a question.","options":[{"id":"quiet","label":"Stay quiet, you do not want a scene","outcome":"A student wrote his figure in her notes, and you watched her do it.","wellbeing":-2},{"id":"ask","label":"Ask a plain question that shows the gap","outcome":"He answered at length and not to the point. The chair thanked you for the clarification and kept an eye on the clock.","wellbeing":2,"skills":{"iq":1,"eq":1}},{"id":"break","label":"Correct him at the break","outcome":"He took it badly for four minutes. By dinner he was quoting you.","skills":{"eq":2}}]},{"id":"n1_dream","min":25,"max":45,"category":"health","title":"The dream diary","prompt":"You have kept a dream diary since college. This year your mornings belong to a project that starts at eight in the lane outside your window. The pen is on the pillow and half of the dream is already gone.","options":[{"id":"write","label":"Write fragments before you move your head","outcome":"You got three words and a drawing of a staircase before the neighbours' radio started. The staircase turned up in your work notes that night.","wellbeing":2,"skills":{"craft":1}},{"id":"skip","label":"Skip it and start early","outcome":"You were first in the lane. The dream was not recoverable.","wellbeing":-1,"skills":{"drive":1}},{"id":"quit","label":"Give up the diary for the year","outcome":"You did not miss it until the spring, when you wanted to.","wellbeing":-2}]},{"id":"n1_checkup","min":25,"max":40,"category":"health","title":"The health van","prompt":"A free health van is parked outside your office offering checkups. You have not had one since college, and the stairs have been getting longer. It is lunchtime.","options":[{"id":"walk","label":"Walk over in your lunch hour","outcome":"They found nothing urgent and a number you disliked. You bought walking shoes, and by October the number was lower.","health":3,"skills":{"physique":1}},{"id":"later","label":"Tell yourself you will go next month","outcome":"Next month came in the form of a deadline. The van moved on.","health":-2},{"id":"ask","label":"Message a friend who is a doctor instead","outcome":"She sent three lines and a question about your sleep. You did not answer the question.","skills":{"eq":1}}]},{"id":"n1_walkout","min":20,"max":35,"category":"family","title":"You stood up","prompt":"At a family meeting about what to do with your degree, voices rise and you stand and leave. The door has not finished closing. Your parent has not said a word.","options":[{"id":"back","label":"Go back and apologise to everyone, the parent first","outcome":"You ate the pride at the table and kept the door.","health":-1,"wellbeing":-1,"skills":{"eq":2}},{"id":"hold","label":"Hold your ground and explain later","outcome":"The explanation came three weeks late. Some doors stayed closed.","wellbeing":-3},{"id":"year","label":"Take a year to think it over","outcome":"You lost a year and gained a view of the whole thing from somewhere else.","cash":-20000,"wellbeing":2,"skills":{"iq":1}}]},{"id":"n1_ikigai","min":35,"max":55,"category":"work","title":"A third of the salary","prompt":"You have a job that pays your bills and does not love you back. This week a friend offers you a place on something you would do for free, at a third of the salary. Your savings would carry you eighteen months.","options":[{"id":"saturdays","label":"Keep the job and do the other thing on Saturdays","outcome":"Saturdays filled up. By October the Saturdays were the week and the week was the rest.","wellbeing":1,"skills":{"craft":1,"drive":1}},{"id":"take","label":"Take the new thing","outcome":"You counted the baht weekly and the work daily. It was the first year you did not look at the clock.","cash":-25000,"wellbeing":4,"skills":{"drive":2}},{"id":"stay","label":"Stay and stop thinking about it","outcome":"Your bills were paid without argument. In March you found yourself reading the advertisement again.","cash":5000,"wellbeing":-3}]},{"id":"n1_topic","min":30,"max":40,"category":"work","title":"A thousand readers","prompt":"A thousand strangers read what you write at night, which you started for yourself. A colleague tells you it should only be about your thesis. Your thesis is late.","options":[{"id":"keep","label":"Keep writing about whatever you wonder about","outcome":"The thesis was late by a month. One reader in another country wrote to ask whether you would teach a class.","wellbeing":2,"skills":{"craft":2}},{"id":"narrow","label":"Narrow it to the thesis","outcome":"It became a smaller, quieter thing and fewer people opened it. The thesis was still late.","wellbeing":-1,"skills":{"iq":1}},{"id":"stop","label":"Stop for a term","outcome":"The thesis was finished early. In the new term you had nothing you wanted to say and no notebook."}]},{"id":"n1_lonely","min":30,"max":50,"category":"health","title":"Wet Friday","prompt":"Alone in a rented flat on a wet Friday, you turn off every light except your laptop screen. It is not bad, and you notice you are enjoying it. Your phone has three messages from people who could come over.","options":[{"id":"stay","label":"Stay in and finish the episode","outcome":"You poured a second glass and watched until two. In the morning you felt lightly rested and slightly alone.","wellbeing":2},{"id":"call","label":"Call one of them","outcome":"They arrived with takeaway and left at midnight. You talked about work for two hours and neither of you got to the real thing.","cash":-600,"wellbeing":1,"skills":{"eq":2}},{"id":"walk","label":"Walk in the rain","outcome":"You were the only person on the footbridge. You got home wet and ate toast over the sink.","health":2,"wellbeing":2}],"years":[2005,2040]},{"id":"n2_ten_days","min":25,"max":60,"category":"family","title":"Ten days of afternoons","prompt":"Your father died on a Monday. The monks come at dusk, the guests from three provinces come after lunch, and someone has to find the photographs for the booklet. Nobody has had time to sit down since.","options":[{"id":"work","label":"Take the booklet, the photographs, the guest list","outcome":"You sorted nine hundred photographs on the floor. On the eleventh day you slept for fourteen hours.","health":-2,"wellbeing":2,"skills":{"eq":1}},{"id":"sit","label":"Sit at the back and let others run it","outcome":"Your aunt ran it. You watched the same candle for most of ten afternoons and ate very little.","health":-1,"wellbeing":-4},{"id":"pay","label":"Hire a company to run all of it","outcome":"It went smoothly and the bill was long. At the end you could not say who had been there.","cash":-18000,"wellbeing":-3}]},{"id":"n2_trip_plan","min":35,"max":60,"category":"family","title":"The trip you planned","prompt":"Your mother's husband retires in March. You have been saving for years to take him to the places he only knows from stamps. The tickets are in a drawer, unbooked.","options":[{"id":"wait","label":"Wait until he has actually retired","outcome":"He retired on a Friday. The plan stayed in the drawer longer than the spring did.","wellbeing":-5},{"id":"book","label":"Book the first leg now, while he still works","outcome":"He packed a week early and laughed at himself for it. You flew in April.","cash":-8000,"health":2,"wellbeing":5},{"id":"near","label":"Take him somewhere close, this month","outcome":"You went three hours by bus to a river he had never seen. He talked the whole way back.","cash":-1500,"health":1,"wellbeing":4,"skills":{"eq":1}}]},{"id":"n2_busy_year","min":20,"max":40,"category":"connection","title":"A year without free hours","prompt":"You are in a city where you know almost nobody, with four classes, a reading list and a bike. Every evening there is exactly enough left to eat and sleep. Someone at the corner shop asks if you are lonely.","options":[{"id":"busy","label":"Keep every hour full","outcome":"It was your most productive year. You noticed in the spring that you had not said a sentence aloud on three weekends.","health":1,"wellbeing":-1,"skills":{"drive":2,"iq":1}},{"id":"one","label":"Keep one evening a week for a neighbour","outcome":"The meals were dull and you went anyway. By autumn there were four people who would have noticed if you stopped.","cash":-600,"wellbeing":4,"skills":{"eq":2}},{"id":"drop","label":"Drop a course to make room","outcome":"You failed to miss it. There was a free Thursday afternoon you did not know what to do with.","health":1,"wellbeing":1}]},{"id":"n2_fast_walker","min":20,"max":40,"category":"connection","title":"She walks very fast","prompt":"A colleague who says she answers to nobody crosses every street on the green and stops at an empty junction to wait for the light. You were meant to talk about the project, but she is already two steps ahead. She texts that evening to ask why you are not following her page.","options":[{"id":"say","label":"Tell her you would rather talk than keep up","outcome":"She went quiet, then said that was fair. The project got done in a café, sitting down.","wellbeing":2,"skills":{"eq":1}},{"id":"follow","label":"Follow her page and say nothing","outcome":"You liked her posts for a year. Neither of you learned much.","health":-1,"wellbeing":-2},{"id":"fade","label":"Stop replying","outcome":"It cost nothing and it felt like something. You still catch yourself looking for her at crossings.","wellbeing":-1}]},{"id":"n2_no_children","min":30,"max":55,"category":"connection","title":"You have no children","prompt":"You posted an article asking why people have them, and said you would not. A colleague replied that someone without a child has no right to the question. Another wrote that he simply did not want to miss the experience.","options":[{"id":"answer","label":"Answer the question he asked, not the one about you","outcome":"You wrote three lines about the evidence. He did not reply and two others did.","wellbeing":2,"skills":{"iq":1}},{"id":"reply","label":"Point out what he just did","outcome":"It was correct and it felt good for about an hour. He stopped sitting near you at lunch.","wellbeing":-2},{"id":"quiet","label":"Delete the post","outcome":"The thread died. You felt tidy and a little cheated.","wellbeing":-1}]},{"id":"n2_twentyseven","min":20,"max":35,"category":"family","title":"Everyone says 27","prompt":"Your aunts have been counting. The list of people you could marry has grown to four, none of whom you have a view on. Your mother has not said anything, which is how you know it matters.","options":[{"id":"talk","label":"Ask her what she is actually afraid of","outcome":"It was not what you had guessed. You talked until the rice went cold.","wellbeing":4,"skills":{"eq":2}},{"id":"date","label":"Agree to meet the shortlist","outcome":"Three coffees, one second coffee, nothing. Your mother was kind about it.","cash":-700,"wellbeing":-1},{"id":"refuse","label":"Tell the aunts you will decide when you decide","outcome":"The phone calls stopped for a month and then resumed at a lower pitch.","wellbeing":2,"skills":{"drive":1}}]},{"id":"n2_bad_boss","min":25,"max":55,"category":"work","title":"Your name comes off it","prompt":"Your manager presented your forecast on Tuesday as his own. In the afternoon he asked you to write his reply to the director. It is the third time this year.","options":[{"id":"say","label":"Put it in writing, copy the director","outcome":"He was cold with you for a month. The director began to ask you things directly.","health":-2,"wellbeing":2,"skills":{"eq":1,"drive":1}},{"id":"swallow","label":"Write the reply","outcome":"It was a good reply. His next review mentioned your initiative.","wellbeing":-5},{"id":"leave","label":"Start looking quietly","outcome":"Seven interviews, one offer, a salary that was not better. You started on a Monday.","cash":-2000,"wellbeing":3,"skills":{"drive":1}}]},{"id":"n2_false_word","min":30,"max":55,"category":"work","title":"The story about you","prompt":"A colleague who envies your classes tells the head of department that you are padding your hours. Nobody has asked you. You hear it from the cleaner, who heard it from a student.","options":[{"id":"direct","label":"Ask for a meeting with her in the room","outcome":"She went pale at the table. It was over by the time the tea arrived.","health":-3,"wellbeing":2,"skills":{"eq":1}},{"id":"log","label":"Hand in your timesheets and nothing else","outcome":"The numbers spoke. The head of department did not apologise and you did not ask.","health":-1,"wellbeing":-1},{"id":"story","label":"Tell your own version around the office","outcome":"By Friday two stories were going round. Nobody remembered which one started first.","health":-3,"wellbeing":-4}]},{"id":"n2_polite_no","min":20,"max":40,"category":"connection","title":"You said no too fast","prompt":"A man you barely know asks you to join a hiking trip on Saturday. You almost say no because saying yes seems too eager. He is already looking down at his phone.","options":[{"id":"later","label":"Say you will think about it","outcome":"You thought about it until Friday. He found someone else.","wellbeing":-2},{"id":"yes","label":"Say yes before you think","outcome":"The path was longer than advertised. You were sunburnt and talked more than you had in a month.","cash":-400,"health":-1,"wellbeing":4,"skills":{"eq":1}},{"id":"no","label":"Say no, politely","outcome":"You had a quiet Saturday. It was fine and you could not say what it was for.","wellbeing":-1}]},{"id":"n2_lottery","min":25,"max":65,"category":"money","title":"The jackpot ticket","prompt":"You win a sum large enough that it rings in the building. By evening a cousin you have not seen for years has your number. A neighbour wants to borrow for a stall.","options":[{"id":"quiet","label":"Tell two people and put it in a plain account","outcome":"Most of it stayed there. Two cousins still got their share and nobody made a list.","cash":30000,"health":-1,"wellbeing":3},{"id":"give","label":"Give some to everyone who asks","outcome":"The money lasted a season. You had many friends for most of it.","cash":20000,"health":-2,"wellbeing":-3,"skills":{"eq":1}},{"id":"spend","label":"Buy the car you always wanted","outcome":"It was a very good car. By March you were explaining the rest to the people who asked.","cash":-40000,"wellbeing":-4}]},{"id":"n2_window_smoke","min":20,"max":45,"category":"health","title":"Ash on the field below","prompt":"You smoke at an open window on the thirteenth floor, which is forbidden. You have coughed every morning since arriving. The ash lands on the empty field and you notice you cannot taste the cigarette.","options":[{"id":"stop","label":"Put it out and throw the pack down after it","outcome":"You did not stop because you were strong. You stopped because it no longer made sense, and the cough eased in a month.","cash":1500,"health":5,"wellbeing":3,"skills":{"iq":1}},{"id":"half","label":"Cut down to two a day","outcome":"You smoked fewer and counted more. The cough stayed.","health":-3,"wellbeing":-2},{"id":"same","label":"Light another","outcome":"The window was cold and so was the pack. The cough had a name by Christmas.","cash":-1500,"health":-4,"wellbeing":-1}]},{"id":"n2_last_pen","min":20,"max":70,"category":"money","title":"Until it has no use","prompt":"Your phone case is cracked and the shop has a new one for the price of a lunch. The old one still holds the phone. You know exactly where you bought it and what you were doing that day.","options":[{"id":"keep","label":"Keep using it","outcome":"It lasted another year and fitted your hand better than any new one.","wellbeing":2},{"id":"buy","label":"Buy the new one","outcome":"It was fine and it was yours for about a week.","cash":-600},{"id":"repair","label":"Mend the old one with glue","outcome":"The glue was visible. You stopped noticing in March.","cash":-50,"wellbeing":2,"skills":{"craft":1}}]},{"id":"n2_storage","min":30,"max":65,"category":"money","title":"The unit you never open","prompt":"You pay a monthly fee for a storage unit full of boxes. You have not opened it since you moved. The renewal letter arrives with a small increase.","options":[{"id":"open","label":"Spend a Saturday going through it","outcome":"Eleven boxes became two. The rest went to a charity shop and a skip.","cash":1200,"health":-1,"wellbeing":5,"skills":{"drive":1}},{"id":"pay","label":"Pay another year","outcome":"The boxes stayed sealed. The letter came again.","cash":-4800,"wellbeing":-2},{"id":"sell","label":"Sell the lot without looking","outcome":"A dealer took it in an afternoon. You never learned what was in the third box.","cash":900,"wellbeing":1}]},{"id":"n2_island_farm","min":25,"max":50,"category":"connection","title":"Three days on the island","prompt":"You take a bus, a boat and a bike to a cold farm where there is no heating and a squat toilet. The people who feed you have no reason to. They keep refilling your bowl.","options":[{"id":"help","label":"Ask to work in the fields","outcome":"You carried water and pulled up roots. Your hands were sore for a week.","health":2,"wellbeing":4,"skills":{"physique":1}},{"id":"stay","label":"Stay the third night as well","outcome":"You slept in a metal cabin and woke up stiff. Three people asked you to come back in spring.","cash":-300,"health":-2,"wellbeing":6,"skills":{"eq":2}},{"id":"city","label":"Go back on the afternoon boat","outcome":"The city was loud and warm and you were glad. You thought about the farm on the way home.","health":1,"wellbeing":-2}]},{"id":"n2_no_award","min":15,"max":25,"category":"work","title":"Failed again, sat again","prompt":"You failed two main subjects and your teachers will let you re-sit them. You have never won anything, not even tenth place. The only thing you enjoy is drawing buildings.","options":[{"id":"draw","label":"Spend the evenings drawing, scrape the re-sits","outcome":"You passed with the lowest mark they allowed. Your sketchbook was full by summer.","health":-1,"wellbeing":3,"skills":{"craft":3,"drive":1}},{"id":"study","label":"Give every evening to the failed subjects","outcome":"You passed with room to spare and hated each page.","health":-2,"wellbeing":-2,"skills":{"iq":2}},{"id":"coast","label":"Hope the teachers feel sorry for you","outcome":"Two of them did. The third did not.","wellbeing":-3}]},{"id":"n2_fast_track","min":25,"max":45,"category":"work","title":"A shortcut to respect","prompt":"A friend tells you she wants the advanced degree because it makes people respect you. She has no research question and says that is fine. You are asked to write her a reference.","options":[{"id":"honest","label":"Write what you actually know of her","outcome":"The reference was short and true. She did not ask you for another.","wellbeing":1,"skills":{"eq":1}},{"id":"glow","label":"Write something warm and general","outcome":"She got in. You did not hear how it went.","wellbeing":-2},{"id":"decline","label":"Say you are the wrong person to ask","outcome":"She took it hard. You both found it easier not to talk after that.","health":-1,"wellbeing":-1}]},{"id":"n2_how_know","min":15,"max":20,"category":"family","title":"How do you know?","prompt":"A classmate told another classmate who told you that a third boy copied in the exam. You repeat it at dinner, pleased to be the one who knows. Your father puts down his spoon and asks whether you saw it.","options":[{"id":"admit","label":"Say you only heard it","outcome":"He said that in this house you would say what you saw. It was the only time that year he was not gentle.","wellbeing":-2,"skills":{"eq":1}},{"id":"swear","label":"Say everybody knows","outcome":"He asked who everybody was. You could name nobody.","health":-1,"wellbeing":-4},{"id":"report","label":"Offer to ask the boy yourself tomorrow","outcome":"You did. He denied it, and you believed him and were not sure why.","wellbeing":2,"skills":{"eq":2}}]},{"id":"n2_off_record","min":25,"max":60,"category":"work","title":"Do not say I said","prompt":"A colleague pulls you aside to tell you something about a manager. She ends with, do not tell anyone I said this. You have not been asked to do anything with it.","options":[{"id":"stop","label":"Ask what she saw herself","outcome":"She had seen very little. The conversation ended in the lift.","wellbeing":1,"skills":{"eq":1}},{"id":"listen","label":"Listen to all of it","outcome":"It was a good story. You looked at the manager differently for months.","health":-1,"wellbeing":-2},{"id":"pass","label":"Tell your closest colleague, who tells two more","outcome":"By Thursday the manager asked why the team had gone quiet around him.","health":-2,"wellbeing":-4}]},{"id":"n2_twelve_hours","min":25,"max":60,"category":"work","title":"Twelve-hour layover","prompt":"Your employer's travel agent put a twelve-hour gap in your ticket. You have no visa to leave the airport, one lounge, and a battery at sixty percent. You have slept three hours already.","options":[{"id":"read","label":"Read and write until the gate opens","outcome":"You wrote four pages and finished a book. Your back hurt for a day.","health":-2,"wellbeing":3,"skills":{"iq":1,"drive":1}},{"id":"rest","label":"Find a bench and sleep properly","outcome":"You arrived on time and fresh. The meeting went better than it should have.","health":2,"wellbeing":1},{"id":"complain","label":"Spend the evening arguing with the agent","outcome":"A refund appeared in three weeks. The twelve hours were already gone.","cash":300,"health":-2,"wellbeing":-3}]},{"id":"n2_ribbon","min":25,"max":60,"category":"money","title":"The gadget suitcase","prompt":"A suitcase with its own tracker costs five hundred dollars and needs two sets of batteries. Your mother suggests tying a coloured ribbon on the handle of the one you have. You have never lost a bag, and she knows that.","options":[{"id":"ribbon","label":"Tie the ribbon","outcome":"It lasted six years. Twice a stranger said they liked it.","wellbeing":2},{"id":"gadget","label":"Buy the case with the tracker","outcome":"The tracker worked until the phone died. The bag arrived on time anyway.","cash":-5000,"wellbeing":-1},{"id":"both","label":"Do both, in case","outcome":"You paid for a safety net and a ribbon. Nothing was lost.","cash":-5000}]},{"id":"n2_expectation","min":20,"max":45,"category":"connection","title":"What she wanted from you","prompt":"You thought she liked you because you said hard things. She wanted a pat on the shoulder every time. You are both tired of explaining, and still holding the same two cups of tea.","options":[{"id":"say","label":"Say what you each assumed, out loud","outcome":"It took an hour and nobody raised their voice. It was the first time either of you had said it.","wellbeing":3,"skills":{"eq":2}},{"id":"adjust","label":"Be softer for a while","outcome":"It worked for a month. Then you went back to the usual.","health":-1,"wellbeing":-1},{"id":"go","label":"Let it end","outcome":"She nodded as if she had expected it. You walked home the long way.","wellbeing":-2}]},{"id":"n2_cant_leave","min":25,"max":60,"category":"family","title":"I cannot imagine without him","prompt":"A friend tells you again that her relationship is unkind and that she cannot picture her life without him. She has said this for two years. She cries a little and then asks what you think.","options":[{"id":"ask","label":"Ask what she would do tomorrow if she could","outcome":"She named three things and was quiet. She said nothing about him.","wellbeing":2,"skills":{"eq":2}},{"id":"advice","label":"Tell her to leave","outcome":"She was angry for a week. Then she called to ask how.","health":-1},{"id":"listen","label":"Pour the tea and say nothing","outcome":"She felt heard. She called again the following Thursday with the same question.","wellbeing":-1}]},{"id":"n2_tenure","min":30,"max":60,"category":"work","title":"Signed for life","prompt":"You are offered a permanent contract. You are the first in your family with one, and your colleagues have told you what it does to a person. Your mother wants you to sign today.","options":[{"id":"sign","label":"Sign it and promise yourself to stay hungry","outcome":"Your salary arrived on the first of every month. You kept the promise for nearly two years.","cash":8000,"wellbeing":1},{"id":"wait","label":"Ask for a fixed-term contract","outcome":"Your manager looked at you for a long time. You got your three years.","health":-1,"wellbeing":3,"skills":{"drive":1}},{"id":"refuse","label":"Decline and freelance","outcome":"The first quarter was lean. By the second you had three clients who had not heard of each other.","cash":-6000,"health":-1,"wellbeing":3,"skills":{"drive":2}}]},{"id":"n2_twentyfour","min":20,"max":60,"category":"work","title":"The unsent email","prompt":"At eleven at night you write an email that tells a client exactly what you think of her. It is accurate and you are very pleased with it. It is a draft.","options":[{"id":"sleep","label":"Leave it overnight and read it at nine","outcome":"At nine it was three sentences shorter. She wrote back to say thank you.","cash":600,"wellbeing":2,"skills":{"eq":1}},{"id":"send","label":"Send it","outcome":"She replied the same night. You lost the client and kept the email.","cash":-3000,"health":-1,"wellbeing":-3},{"id":"delete","label":"Delete it and write nothing","outcome":"The client assumed you had agreed. It cost you in the spring.","cash":-1000,"wellbeing":-2}],"years":[1998,2040]},{"id":"n2_ninety_percent","min":30,"max":55,"category":"money","title":"Ninety percent of the room","prompt":"You are moving out in three weeks and your room is full of things you bought without thinking. You do not use most of them and some you cannot name. A friend says he will take whatever you leave in the hall.","options":[{"id":"purge","label":"Give away nine tenths","outcome":"The room was empty on the second weekend. You slept better than you had in a year.","cash":600,"health":1,"wellbeing":5},{"id":"box","label":"Box it all and move it","outcome":"The truck took two trips. You paid for it and unpacked half.","cash":-2500,"health":-1,"wellbeing":-2},{"id":"sell","label":"Sell what has value, bin the rest","outcome":"You made some money and a lot of trips to a recycling bin.","cash":1800,"wellbeing":1,"skills":{"craft":1}}]},{"id":"n2_unpaid_hall","min":20,"max":40,"category":"work","title":"An unpaid hour, front row","prompt":"A teacher asks if someone will give a guest lecture to a half-empty hall. There is no fee. You are not sure you know enough, and the room smells of chalk.","options":[{"id":"yes","label":"Say yes and prepare properly","outcome":"Nineteen people came. One of them found you afterwards to ask a real question.","wellbeing":3,"skills":{"iq":1,"eq":1}},{"id":"maybe","label":"Say you will see if you are free","outcome":"They found someone else. You heard later it went well.","wellbeing":-2},{"id":"ask","label":"Ask them to pay","outcome":"They could not. The hall stayed empty.","wellbeing":-1}]},{"id":"n2_gets_to_point","min":20,"max":45,"category":"work","title":"Fifteen seconds","prompt":"An older colleague with no patience for preamble has agreed to read your proposal, if you can tell him the point first. You have written eleven pages that start from 1990. He is standing at your door with his coat on.","options":[{"id":"point","label":"Lead with the one thing you want","outcome":"He nodded and sat down. The proposal got a yes in eight minutes.","cash":3000,"wellbeing":3,"skills":{"iq":1,"eq":1}},{"id":"chron","label":"Walk him through the history first","outcome":"He glanced at the clock twice. You never found out what he thought.","health":-1,"wellbeing":-3},{"id":"hand","label":"Hand him the eleven pages","outcome":"He took it home and did not read it. You discovered this on Monday.","wellbeing":-2}]},{"id":"n2_first_trip","min":30,"max":60,"category":"health","title":"The first trip for yourself","prompt":"For years every journey has been for a meeting, a talk, or a slide. You are at a gate with a ticket to a city where you have nothing to present. A friend there says he will meet you on the third day.","options":[{"id":"work","label":"Open the laptop in the hotel","outcome":"You answered forty messages. The city went on without you.","health":-1,"wellbeing":-3},{"id":"walk","label":"Walk all day, as far as the trains allow","outcome":"You covered twenty-eight kilometres and ate once. Your feet blistered and your head cleared.","cash":-500,"health":2,"wellbeing":5,"skills":{"physique":1}},{"id":"plan","label":"Plan each hour in a notebook","outcome":"The notebook was full and the days were fine. You came home needing a holiday.","cash":-300,"health":-1,"wellbeing":1}],"years":[2005,2040]},{"id":"n2_lost_pen","min":25,"max":65,"category":"family","title":"The pen from your father","prompt":"He gave you a fountain pen when you graduated, and you have used it for everything important since. On the last day of a trip you reach into your bag and it is not there. The taxi has gone.","options":[{"id":"let","label":"Decide it was always going to be lost","outcome":"You stopped looking by the time you landed. You still reach for the empty slot sometimes.","wellbeing":-3,"skills":{"eq":1}},{"id":"call","label":"Call the taxi company and the hotel, repeatedly","outcome":"The pen did not come back. You spent two days being polite on the phone and got a refund for the fare.","cash":-100,"health":-1,"wellbeing":-5},{"id":"buy","label":"Buy a plain pen at the airport and use it","outcome":"It wrote badly. You signed the next contract with it anyway, and it was fine.","cash":-30,"wellbeing":-2,"skills":{"eq":1}}]},{"id":"n2_resolutions","min":20,"max":65,"category":"health","title":"A list in the notebook","prompt":"On the fifty-second day of the year you finally write the resolutions: more sleep, fewer cigarettes, a walk after lunch. You have written them down every year since you were twenty. A pedometer arrives in the post.","options":[{"id":"small","label":"Pick one and do it for thirty days","outcome":"You walked after lunch every day. By March you were sleeping better without having changed anything else.","health":3,"wellbeing":3,"skills":{"physique":1}},{"id":"all","label":"Start all of them on Monday","outcome":"It lasted nine days. The pedometer ended up in a drawer.","cash":-30,"health":-1,"wellbeing":-3},{"id":"skip","label":"Put the notebook away again","outcome":"Nothing changed. The list was the same next February.","health":-1,"wellbeing":-1}]},{"id":"n3_lights","min":20,"max":45,"category":"work","title":"The lights go out","prompt":"The night before the big exam the power cuts at nine. Your phone is at four percent and the alarm is on it. Everyone you asked to wake you is asleep.","options":[{"id":"shop","label":"Walk to the corner shop for a wind-up clock","outcome":"The shop was shut. A night guard lent you his, and you slept in your clothes.","health":-1,"wellbeing":1,"skills":{"drive":1}},{"id":"wake","label":"Ask the neighbour to knock at five","outcome":"They knocked at five without being asked twice. You arrived with a creased face and your pen.","health":-2,"wellbeing":2,"skills":{"eq":1}},{"id":"trust","label":"Trust you will wake up","outcome":"You woke at eight with the room already bright. You took the exam late and said nothing about it.","health":-4,"wellbeing":-5}]},{"id":"n3_sideline","min":25,"max":55,"category":"money","title":"A quiet rumour","prompt":"People in the corridor have started talking in low voices about the company. Nothing is announced. In your drawer there is a half-finished thing you do for fun, on weekends, that pays nothing.","options":[{"id":"weekend","label":"Give it a few real hours every Saturday","outcome":"It paid forty baht the first month and four thousand the sixth. When the notice came, you had somewhere to stand.","wellbeing":3,"skills":{"craft":2,"drive":1}},{"id":"allin","label":"Put everything into the job and hope","outcome":"The notice came in March anyway. You spent the first week trying to remember what else you could do.","health":-2,"wellbeing":-6},{"id":"both","label":"Update your profile and call two old contacts","outcome":"One call came back with a lunch, the other with silence. You went to the lunch.","cash":-500,"wellbeing":1,"skills":{"eq":1}}]},{"id":"n3_deleteapps","min":25,"max":70,"category":"health","title":"Three hours back","prompt":"You count what the news apps take in a day and it comes to three hours. The apps tell you about a lot of places you will never go. Your own street has a new noodle shop you have not noticed.","options":[{"id":"delete","label":"Delete the apps and keep a weekly paper","outcome":"The first week you reached for the phone eleven times. By the third you were cooking dinner and no one had to tell you why.","health":2,"wellbeing":4,"skills":{"iq":1}},{"id":"limit","label":"Allow half an hour after dinner","outcome":"You kept to half an hour on most days. It was still the part of the day you remembered worst."},{"id":"keep","label":"Keep going as before","outcome":"You knew every headline by lunch. You also knew very little about the person at the next desk.","health":-1,"wellbeing":-3}],"years":[2012,2040]},{"id":"n3_uniform","min":20,"max":60,"category":"money","title":"The same shirt","prompt":"Your wardrobe has thirty items and you wear six. You lose ten minutes every morning deciding, then change twice. A man at work wears the same grey shirt every day and nobody mentions it.","options":[{"id":"few","label":"Keep five shirts and two trousers, give away the rest","outcome":"Mornings became quiet. The bag you gave to the temple fair was heavier than you expected.","cash":2500,"wellbeing":3,"skills":{"drive":1}},{"id":"sell","label":"Sell the better pieces online","outcome":"Three sold, two did not. The money covered a month of rice and an umbrella.","cash":4000,"wellbeing":1},{"id":"buy","label":"Buy a few more to \"fix\" the problem","outcome":"The new shirts hung beside the old ones. You still stood in front of the closet.","cash":-3000,"wellbeing":-3}],"years":[2005,2040]},{"id":"n3_pingpong","min":15,"max":50,"category":"work","title":"The quick answer","prompt":"A colleague asks, out loud, what a ball costs if a bat and a ball cost one hundred and ten together and the bat costs a hundred more. You say ten before they finish. The room goes quiet in the wrong way.","options":[{"id":"pen","label":"Ask for a pen and do the sum","outcome":"It was five. The room laughed with you, which is different from at you.","wellbeing":2,"skills":{"iq":2}},{"id":"defend","label":"Insist that ten is right","outcome":"You argued for six minutes with a napkin. The napkin disagreed with you.","wellbeing":-3},{"id":"skip","label":"Laugh it off and change the subject","outcome":"Nobody pressed. You checked it later on the bus, alone, and felt oddly small.","wellbeing":-1,"skills":{"iq":1}}]},{"id":"n3_slips","min":25,"max":60,"category":"work","title":"The loud meeting","prompt":"Your manager says her idea first and the whole table nods before she has finished. You have a different idea on a scrap of paper in your pocket. Nobody at the table has heard it, and nobody knows you have one.","options":[{"id":"write","label":"Suggest everyone write ideas on slips before talking","outcome":"Twelve slips went into the box. The best one was not hers, and it was not yours either.","wellbeing":3,"skills":{"eq":2}},{"id":"speak","label":"Speak up over the nodding","outcome":"You were heard, and you were also marked. Both of those lasted.","health":-1,"skills":{"drive":1}},{"id":"hold","label":"Keep the paper in your pocket","outcome":"The meeting ended with the loudest plan. Your paper went through the wash.","wellbeing":-3}]},{"id":"n3_redpen","min":18,"max":45,"category":"work","title":"Marked in red","prompt":"Your draft comes back with every page covered in red ink. A friend gets the same assignment back with a tick and a smile at the top. You are not sure which of you was read.","options":[{"id":"thank","label":"Read every mark and thank the reviewer","outcome":"The third rewrite was the first that was yours. You kept the marked copy in the drawer.","wellbeing":3,"skills":{"craft":2,"iq":1}},{"id":"half","label":"Fix the easy marks and ignore the rest","outcome":"The next draft came back with the same marks, fewer of them red.","skills":{"craft":1}},{"id":"sulk","label":"Say the reviewer does not understand the subject","outcome":"You said it to anyone who would listen. Fewer people did each week.","wellbeing":-3}]},{"id":"n3_atm","min":20,"max":65,"category":"money","title":"Ninety, not a hundred","prompt":"The machine asks how much. You always take a thousand and it is always gone by Friday. This time you take nine hundred and the receipt looks the same.","options":[{"id":"less","label":"Withdraw a little less each time","outcome":"After ten visits there was a thousand-baht note in the book that you had never seen go in.","cash":1000,"wellbeing":2,"skills":{"drive":1}},{"id":"same","label":"Take the usual amount","outcome":"It was gone by Friday. You did not remember what for."},{"id":"more","label":"Take more to be safe","outcome":"The extra went on things you also did not need. The wallet felt rich all week.","cash":-1200,"wellbeing":-2}]},{"id":"n3_noodle","min":25,"max":65,"category":"money","title":"Is the broth good","prompt":"A woman with a noodle stall wants to repaint it, add neon, and put in plastic stools for the young. Her regulars say nothing. You are standing at her cart with a bowl and an opinion you have not been asked for.","options":[{"id":"taste","label":"Say the bowl is good and the sign can wait","outcome":"She tasted the broth herself that night and changed one thing. The queue was longer by August.","wellbeing":3,"skills":{"eq":1}},{"id":"paint","label":"Help her pick colours for the paint","outcome":"The stall looked nice. The broth did not change and neither did the line.","cash":-2500},{"id":"shrug","label":"Finish and say nothing","outcome":"You left a good tip. She repainted anyway, and for three months the stall smelled of paint.","cash":-200,"wellbeing":-1}],"years":[2012,2040]},{"id":"n3_recorder","min":25,"max":55,"category":"work","title":"The red light","prompt":"You are visiting a household for a survey. The recorder runs out of battery in the middle of a sentence. The man you are talking to relaxes visibly and puts down his tea.","options":[{"id":"listen","label":"Put the notebook down and keep listening","outcome":"He told you about the loan, then about the roof, then about why he would not tell the others. You wrote it all down in the bus.","wellbeing":3,"skills":{"eq":2}},{"id":"replace","label":"Ask for a few minutes to find a charger","outcome":"By the time you were back he had decided to be polite. The answers got shorter.","wellbeing":-2},{"id":"push","label":"Switch to the form and keep to the plan","outcome":"The form was filled in. It was true in every box and told you nothing.","wellbeing":-3,"skills":{"iq":1}}]},{"id":"n3_letters","min":18,"max":35,"category":"work","title":"The twenty-first letter","prompt":"There is a drawer in your desk for rejection letters. Yesterday you added the twentieth. Today there is another envelope with the same logo and a slightly thicker feel.","options":[{"id":"open","label":"Open it standing up in the corridor","outcome":"It was a yes, with a form to sign. You read it twice and then went to wash your face.","cash":5000,"wellbeing":6,"skills":{"drive":2}},{"id":"later","label":"Leave it unopened until the weekend","outcome":"You worried through two days and then it said no. You wished you had opened it sooner.","health":-1,"wellbeing":-3},{"id":"stop","label":"Stop applying and take a job nearby","outcome":"The job was fine. In the drawer the letters stayed.","cash":3000,"wellbeing":-2}]},{"id":"n3_stage","min":22,"max":55,"category":"work","title":"The blank stage","prompt":"Your first talk to a hall of strangers. You have a script and you have memorised it, and you realise on stage that you do not really believe the third slide. The front row has phones out.","options":[{"id":"own","label":"Say the third slide in your own words","outcome":"It came out clumsy and true. Afterwards two people asked you something you could answer.","health":-1,"wellbeing":4,"skills":{"eq":2,"craft":1}},{"id":"script","label":"Read the script to the end","outcome":"Nobody remembered a word of it, including you, and the coffee break came as a relief.","health":-2,"wellbeing":-3},{"id":"stop","label":"Stop and say you lost your place","outcome":"The hall laughed in the kind way. You found your place and the rest was easier.","health":-1,"wellbeing":2,"skills":{"drive":1}}]},{"id":"n3_goodenough","min":25,"max":55,"category":"work","title":"Another draft","prompt":"The report has been ready for a month and you keep changing commas. Your supervisor says, flatly, that wanting it perfect is a kind of arrogance. He is waiting for it on his desk.","options":[{"id":"send","label":"Send it as it stands","outcome":"It came back with eleven comments, none of them fatal. You were done by Friday.","wellbeing":4,"skills":{"drive":1}},{"id":"one","label":"Do one last pass and send it Monday","outcome":"Monday it went. The last pass changed nothing a reader would ever see.","health":-1},{"id":"hold","label":"Hold it another week","outcome":"The week was spent on one table. The deadline slipped past without a sound.","health":-2,"wellbeing":-4}]},{"id":"n3_deadline","min":20,"max":60,"category":"work","title":"The three-week buffer","prompt":"You tell your boss two weeks. You have never finished anything in the time you promised. A colleague who is rarely wrong tells you to add three weeks and say nothing about the buffer.","options":[{"id":"pad","label":"Quote five weeks and deliver in four","outcome":"They were pleased. You were the first person on the team nobody chased.","wellbeing":3,"skills":{"drive":1}},{"id":"tight","label":"Quote the two weeks you believe","outcome":"You delivered in five. Every status meeting was spent explaining.","health":-2,"wellbeing":-4},{"id":"split","label":"Split it into three small deliveries","outcome":"The first slipped by two days. By the third you knew exactly how long things took.","wellbeing":1,"skills":{"iq":1}}]},{"id":"n3_promoted","min":22,"max":60,"category":"connection","title":"Someone else's promotion","prompt":"A friend tells you at lunch that he has been promoted. At the next table a man is explaining why somebody else got a better one. You feel something warm and sour that is not about him.","options":[{"id":"glad","label":"Say you are glad, and mean it by dessert","outcome":"The sentence was false in the first half and true in the second. He paid for the soup.","wellbeing":3,"skills":{"eq":2}},{"id":"echo","label":"Agree with the man at the next table","outcome":"You said it too quietly to count, and loudly enough to remember.","wellbeing":-4},{"id":"walk","label":"Pay and walk back alone","outcome":"You looked at your own desk for a long time. By Thursday you had written a list of what you wanted.","skills":{"drive":1}}]},{"id":"n3_horn","min":18,"max":70,"category":"connection","title":"A horn behind you","prompt":"A car sounds its horn behind you at the light. You have not done anything wrong, as far as you know. The driver is mouthing something through the glass.","options":[{"id":"move","label":"Pull to the left and let him pass","outcome":"He went by without looking. By the next junction you had forgotten his car.","wellbeing":2},{"id":"stare","label":"Stare back in the mirror","outcome":"The light went green and stayed green. The rest of the morning had a grain in it.","health":-1,"wellbeing":-3},{"id":"stop","label":"Get out and say something","outcome":"A scooter went around you both. You were late and you were still angry at nine.","cash":-300,"health":-2,"wellbeing":-5}]},{"id":"n3_whisper","min":22,"max":65,"category":"connection","title":"What they say about you","prompt":"A story about you is going round the office. It is not true, and it is detailed. People are friendly in a careful way, and someone you hardly know brings you coffee.","options":[{"id":"wait","label":"Keep working and wait for it to move on","outcome":"You kept the same hours and the same face. In a month someone else was the story.","health":-2,"wellbeing":2,"skills":{"drive":1}},{"id":"correct","label":"Tell it to each person individually","outcome":"Some believed you and some pretended to. The list of people you had told became its own story.","health":-3,"wellbeing":-3},{"id":"ask","label":"Ask the person who told it what they heard","outcome":"It came from three people who had each heard it from the next. Nobody wanted to say where it began.","health":-1,"skills":{"eq":1}}]},{"id":"n3_oldmessage","min":28,"max":65,"category":"connection","title":"The old group chat","prompt":"When you lost your job the group chat stopped answering. Eight months later one message arrives from someone who still shares the name of your old team. It says only: how are you doing.","options":[{"id":"reply","label":"Answer honestly, and ask the same","outcome":"The reply took an hour to write and a minute to send. They called that night.","wellbeing":5,"skills":{"eq":2}},{"id":"fine","label":"Write fine, thanks","outcome":"They wrote good to hear and that was the end of the thread.","wellbeing":-2},{"id":"late","label":"Read it three times and answer next week","outcome":"By next week it felt like an old letter. You did not send anything.","wellbeing":-3}]},{"id":"n3_quietyear","min":28,"max":60,"category":"work","title":"Nothing on the calendar","prompt":"There is no job and the calendar is empty until August. A free online course has begun and the first lesson is difficult in a way that hurts. A relative says: take your time.","options":[{"id":"study","label":"Do the course at a table in the front room","outcome":"You finished three that year. The fourth one led to a conversation that led to work.","health":1,"wellbeing":3,"skills":{"iq":2,"craft":1}},{"id":"help","label":"Do the chores and help in the house first","outcome":"The house was in better order by April. You still had not opened the course.","wellbeing":1,"skills":{"eq":1}},{"id":"wait","label":"Wait for something to arrive","outcome":"Nothing did, in the shape you were waiting for.","health":-2,"wellbeing":-5}],"years":[2005,2040]},{"id":"n3_sevenkilo","min":22,"max":55,"category":"money","title":"Seven kilos","prompt":"The cheap flight allows seven kilos of luggage. You own much more than seven kilos of books, a laptop, a camera, and two pairs of boots. On the floor they look like another person's belongings.","options":[{"id":"give","label":"Give the books away, keep the one on the table","outcome":"The bag closed without sitting on it. In the first hostel you swapped the book for another.","cash":800,"health":1,"wellbeing":3,"skills":{"drive":1}},{"id":"post","label":"Post the rest home and fly light","outcome":"The parcel cost less than the checked bag would have. You found you missed none of it.","cash":-1200,"wellbeing":2},{"id":"pay","label":"Pay for the extra bag","outcome":"The fee at the desk was larger than the flight. You carried the bag through four cities.","cash":-6000,"health":-1,"wellbeing":-2}],"years":[2000,2040]},{"id":"n3_homedesk","min":25,"max":60,"category":"work","title":"The empty office","prompt":"You haven't gone in for three weeks. Nobody sits across from you and there is nobody else's mood to read. Lunch used to be a plate of whatever the group had chosen.","options":[{"id":"cook","label":"Eat one proper meal at midday and walk after","outcome":"The walk was five kilometres by the end of the month. The scale told you something, politely.","cash":300,"health":3,"wellbeing":4,"skills":{"physique":1}},{"id":"screen","label":"Work through lunch at the desk","outcome":"The afternoon became one long afternoon. By seven you had said nothing aloud.","health":-3,"wellbeing":-3},{"id":"call","label":"Phone a colleague once a day, no agenda","outcome":"Most days it was four minutes. It was still the thing you missed most.","wellbeing":2,"skills":{"eq":1}}],"years":[2020,2022]},{"id":"n3_boxes","min":30,"max":70,"category":"family","title":"A parent's boxes","prompt":"You are clearing a parent's room: two typewriters, a transistor radio, cassettes with handwriting on them. A neighbour offers a small sum for the whole lot. The ink on the machines is dry.","options":[{"id":"sell","label":"Sell the lot to the neighbour","outcome":"He paid in cash and counted twice. The room looked larger.","cash":2500,"wellbeing":-3},{"id":"slow","label":"Leave the boxes closed for another year","outcome":"The boxes were still there in the spring. You moved them to a drier corner.","wellbeing":-1},{"id":"keep","label":"Take the typewriters to a repair shop","outcome":"The man at the counter found one broken spring. You typed one page that evening and the paper smelled of oil.","cash":-800,"wellbeing":4,"skills":{"craft":2}}]},{"id":"n3_bite","min":20,"max":70,"category":"health","title":"Something in the dark","prompt":"You come down at midnight to the kitchen and do not turn the light on, because you know the way. Something sharp finds your foot. By the time you find the switch, whatever it was has gone behind the stove.","options":[{"id":"clinic","label":"Go to the emergency room at once","outcome":"They kept you for a night and gave you something for the pain. The foot was twice its size by morning and then slowly was not.","health":-4},{"id":"home","label":"Rinse it and wait to see how it feels","outcome":"The foot swelled through the night. At dawn you were in a taxi anyway, and you paid more than the first trip would have cost.","cash":-6000,"health":-8,"wellbeing":-5},{"id":"toughen","label":"Tell yourself an adult can take it","outcome":"The pain did not read the sentence. You were in the emergency room by seven with a face your mother recognised.","cash":-5000,"health":-7,"wellbeing":-4}]},{"id":"n3_message","min":20,"max":55,"category":"family","title":"A short message","prompt":"You are abroad, a few hours before your first class, when a sibling sends four words about your parent. Nothing else comes after it. Your flight home would be the next night.","options":[{"id":"stay","label":"Attend the class and fly the day after","outcome":"The class was a blur you cannot describe. You landed with your hands still holding the pen.","health":-3,"wellbeing":-3},{"id":"call","label":"Call home and decide after the call","outcome":"The call was ninety minutes. At the end you had a ticket and a list.","cash":-9000,"health":-2,"wellbeing":1,"skills":{"eq":1}},{"id":"home","label":"Take the next flight","outcome":"You arrived after the funeral rites began. Your mother held your sleeve for the whole of the second day.","cash":-12000,"health":-2,"wellbeing":2,"skills":{"eq":2}}]},{"id":"n3_nowornever","min":22,"max":70,"category":"family","title":"Coffee with no reason","prompt":"Someone you like has been on your list for a year. You keep saying next month. This week they replied to a photo you sent and said: when are you free.","options":[{"id":"photo","label":"Send a better photo and say soon","outcome":"You talked for three hours and learned they had been unwell, which they had not mentioned until the second cup. They paid for it."},{"id":"busy","label":"Say you are busy until the new year","outcome":"You were busy until the new year. In January the number was no longer theirs.","wellbeing":-4},{"id":"now","label":"Say tomorrow, and go","outcome":"You talked for three hours and learned that they had been sick, which they had not mentioned until the second cup.","cash":-150,"wellbeing":4,"skills":{"eq":2}}]},{"id":"n3_award","min":30,"max":65,"category":"work","title":"The gold envelope","prompt":"A small award is yours. The ceremony is on a Thursday night, in a hotel, with a tie, and you must say two words of thanks. You were already at your desk before the call.","options":[{"id":"stay","label":"Send a note and stay at your desk","outcome":"The prize was sent by post. The envelope sat on the shelf and the work went on.","wellbeing":2,"skills":{"drive":1}},{"id":"go","label":"Go, tie and all, and sit at the back","outcome":"You shook seven hands and could not name one of them the next day.","cash":-1200,"health":-1},{"id":"dine","label":"Go and bring a colleague who did half the work","outcome":"They went on stage with you. It was the only part you remembered.","cash":-1500,"wellbeing":3,"skills":{"eq":1}}]},{"id":"n3_valve","min":22,"max":60,"category":"work","title":"The pressure valve","prompt":"A coffee machine in a small cafe has stopped on the first morning of a holiday weekend. A line has formed at the door. The part that failed is the one the checklist taped to the wall would have reminded you of.","options":[{"id":"list","label":"Add the valve to the list and fix the machine","outcome":"You were open an hour late and never missed the check again.","wellbeing":2,"skills":{"craft":2}},{"id":"sorry","label":"Close for the morning and apologise at the door","outcome":"Half the line came back at noon. The other half found coffee next door.","cash":-1500,"skills":{"eq":1}},{"id":"fix","label":"Fix it by guesswork, quickly","outcome":"It worked until two o'clock. At two it stopped again, louder.","cash":-2500,"health":-2,"wellbeing":-3}],"years":[2012,2040]},{"id":"n3_ride","min":20,"max":60,"category":"health","title":"The long road","prompt":"You can bike for two hours on a road beside the river. The phone can be in your pocket with the sound on, or off. A podcast is waiting, and so is a text from work that nobody can wait for.","options":[{"id":"off","label":"Turn the phone off and ride","outcome":"At the sixth kilometre the day came loose. You came home slower than you left and in a better mood.","health":4,"wellbeing":4,"skills":{"physique":2}},{"id":"podcast","label":"Ride with the podcast playing","outcome":"The host told you something about a bank. You rode eleven kilometres without noticing any of them.","health":2,"wellbeing":2,"skills":{"iq":1}},{"id":"work","label":"Answer the text first and then ride","outcome":"The text became a call and the call became a report. You did not ride.","health":-2,"wellbeing":-3}],"years":[2012,2040]},{"id":"n3_treadmill","min":25,"max":65,"category":"health","title":"Five more minutes","prompt":"Last month you could not stand twenty minutes on the machine. The building has a gym nobody uses. You have a choice between doing exactly what you did yesterday and doing five minutes more.","options":[{"id":"five","label":"Add five minutes and stop there","outcome":"After eight weeks you were doing an hour. No single day felt like it.","health":4,"wellbeing":3,"skills":{"physique":2,"drive":1}},{"id":"big","label":"Triple it and see what happens","outcome":"The calf complained at once. You limped for nine days.","health":-4,"wellbeing":-2},{"id":"skip","label":"Skip it, since it counts for nothing","outcome":"Nothing counted. By autumn the machine was where you left it.","health":-2,"wellbeing":-2}]},{"id":"n3_replace","min":20,"max":65,"category":"money","title":"The lost phone","prompt":"Your phone goes into the river with the taxi's open door. It held your photos, a little money, and the name of every person you wished you had written down. You can sit on the curb with the loss, or move.","options":[{"id":"without","label":"Go a week without","outcome":"You wrote three letters. You learned which friends you could remember.","wellbeing":3,"skills":{"eq":1}},{"id":"days","label":"Spend two days looking for the old one","outcome":"Fishermen found it on the second day. It did not turn on.","cash":-1500,"health":-1,"wellbeing":-4},{"id":"replace","label":"Buy a cheaper one the same day","outcome":"It took four hours and a queue. By night you had your number back.","cash":-5500,"wellbeing":2,"skills":{"drive":1}}]},{"id":"n3_facade","min":30,"max":65,"category":"work","title":"The pretty front","prompt":"A client wants the front of a building to be the best-looking thing on the street. The inside is a single corridor and two meeting rooms. The renderings look good from the road and nobody has asked what happens in it.","options":[{"id":"room","label":"Ask for a day with the people using it","outcome":"They gave you one. The corridor became a room with a window.","wellbeing":3,"skills":{"eq":1,"craft":1}},{"id":"draw","label":"Draw the front the way they want","outcome":"The front won a prize. The inside was empty by March.","cash":1500,"wellbeing":-2},{"id":"pass","label":"Decline the job","outcome":"Someone else took it. You slept well that week and did not eat much.","cash":-1500,"wellbeing":1}]},{"id":"n3_scraps","min":25,"max":70,"category":"money","title":"What is lying around","prompt":"A neighbour needs a pump to move water and cannot buy one. In his yard there is a tractor wheel, a length of pipe, and a bed frame. He says he is waiting for a solution to come from the city.","options":[{"id":"city","label":"Help him write a request to the district office","outcome":"The letter went in. The pump did not come.","wellbeing":-1},{"id":"build","label":"Offer to build something with him from the scrap","outcome":"It leaked on the first day and worked on the third. The neighbours came to see.","cash":-200,"wellbeing":4,"skills":{"craft":2,"iq":1}},{"id":"lend","label":"Lend him the money for a new one","outcome":"He bought one and paid you back a little each month for a year.","cash":-3500,"wellbeing":2,"skills":{"eq":1}}]}];
