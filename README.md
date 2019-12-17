# URL Shortener

## todolist

- [ ] make sure Unique ID ,makeID()
- [o] different base URL depends on my api url
- [ ] use async await, not callback

## ️❗CAUTION❗

과제는 12/16(월), 19:37 ~22:33분 동안 진행하였고, 제출 완료하였습니다.

commit b84368fbc925ce4f2d4c9cd6837c932815ae87c6
Author: Jeongho Noh <nossi8128@gmail.com>
Date: Mon Dec 16 19:37:16 2019 +0900

    first commit

~

commit cdb0fc97e7f82220f9b92f9b085b0192c6d3ef52
Author: Jeongho Noh <nossi8128@gmail.com>
Date: Mon Dec 16 22:33:02 2019 +0900

    completed the function that add visit time in VisitDB on redirectToURL function

하지만, 개인적으로 아쉬움이 많이 남아 과제 다음날인 12/17(화)에 몇가지 수정을 진행하였습니다. 혹여나 쳥가시 오해와 차질이 생기실 까봐 해당 글을 남깁니다.

### 수정사항

- fs.readFile 과 fs.writeFile을 Promise와 async await를 사용한 방식으로 수정하였습니다.

- 문제에서 post로 받아야 했던 것을 get으로 잘못 프로그래밍 하였습니다. 이를 수정하였습니다.
