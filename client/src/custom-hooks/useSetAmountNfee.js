import { useState } from 'react';

export const useSetAmountNfee = (amountInit) => {
  const [amount, setAmount] = useState(amountInit);
  const [matchesWon, setMatchesWon] =useState(parseInt(localStorage.getItem('mw')));
  const [matchesLost, setMatchesLost] = useState(parseInt(localStorage.getItem('ml')));
  let fee;
  let finalPrice;
  const matchesPlayed = matchesWon + matchesLost;
 console.log(matchesPlayed)

if (matchesPlayed < 5){
  fee = 0.0
  finalPrice= parseFloat(amount)

}else{
  if (amount > 5.01 && amount <= 10.01) {
    fee = 2.0;
    finalPrice= parseFloat(amount) +fee;
  } else if (amount > 10.01) {
    fee = 3.0;
    finalPrice= parseFloat(amount) + fee
  } else if (amount > 0) {
    fee = 1.0;
    finalPrice= parseFloat(amount)+ fee
  } else {
    fee = 0.0;
    finalPrice= 0
  }
}
  return [amount, fee,finalPrice, setAmount];
};
