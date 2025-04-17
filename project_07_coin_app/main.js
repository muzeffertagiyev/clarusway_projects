//? MAIN.JS

// https://api.coinranking.com/v2/search-suggestions?query=bitco
// https://api.coinranking.com/v2/coin/Qwsogvtv82FCd

const options = {
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': 'coinrankinge27a2d0208c27ac92898fbf1b2234d9c4df75b05293c3444',
    },
  };


const searchField = document.querySelector("input")
const searchForm = document.querySelector("form")

const coinsContainer = document.querySelector(".coins");

let coins = []

searchForm.onsubmit = (e)=>{
    e.preventDefault()
    
    if(searchField.value.trim()===''){
        
        Swal.fire({
            position: "top",
            title: "Input Cannot Be Blank",
            icon: 'error',
            confirmButtonText: 'Ok',
            timer: 2000
        })
        searchField.value = ''
        return
    }

    getData() 
    searchForm.reset() 
    showCoins()
}


const getData = async() =>{
    try{

        const response = await fetch(`https://api.coinranking.com/v2/search-suggestions?query=${searchField.value}`,options)


        if(!response.ok){
            throw new Error(`${response.status}, Not Found, Please make sure that the API Url is correct`)
        }

        const data = await response.json()

        if(data.data.coins.length === 0 || !data.data.coins){
            Swal.fire({
                position: "top",
                title: 'Coin Not Found',
                icon: 'warning',
                confirmButtonText: 'Ok',
                timer: 2000,
            })
            return
        }

        const changeResponse = await fetch(`https://api.coinranking.com/v2/coin/${data.data.coins[0].uuid}`)

        const changeData = await changeResponse.json()
        
        addCoin(data,changeData)

    }catch(error){
        document.querySelector("body").innerHTML = `
            <div style="display:flex;justify-content:center; align-items:center; flex-direction:column;">
                <img style="width:50%; margin-bottom:2rem;" src="https://img.freepik.com/free-vector/oops-404-error-with-broken-robot-concept-illustration_114360-5529.jpg?ga=GA1.1.1764166498.1741949823&semt=ais_hybrid&w=740"/>
                <h1>${error}</h1>
            </div>
        `
    }
}

const addCoin = (data,changeData)=>{
    const coin = data.data.coins[0]

    let alreadyExists;
    coins.some((existingCoin)=>{
        if(existingCoin.name === coin.name){
            Swal.fire({
                position: "top",
                title: `${coin.name} Already Exists 😉`,
                icon: 'warning',
                confirmButtonText: 'Ok',
                timer: 2000
            })
            alreadyExists = true
        }
    })

    if(!alreadyExists){
        const newCoin = {
            id:coin.uuid,
            name:coin.name,
            symbol:coin.symbol,
            iconUrl:coin.iconUrl,
            price:Number(coin.price).toFixed(4),
            change:changeData.data.coin.change
        }
    
        coins.push(newCoin)
    }

    showCoins()
}

coinsContainer.addEventListener("click", (event)=>{
    if(event.target.classList.contains("fa-window-close")){
        coins = coins.filter((coin)=> !(event.target.getAttribute("data-id")===coin.id))
        event.target.closest("li").remove()
    }
})


function showCoins(){
    coinsContainer.innerHTML = ''

    coins.forEach((coin)=>{
        coinsContainer.innerHTML +=`
        <li class="coin">
          <div class="remove-icon">
              <i class="fas fa-window-close" data-id="${coin.id}"></i>
          </div>
          <h2 class="coin-name">
              <span>${coin.name}</span>
              <sup>${coin.symbol}</sup>
          </h2>
          <div class="coin-temp"> $${coin.price}</div>
              <figure>
                  <img class="coin-icon" src=" ${coin.iconUrl} ">                
                  <figcaption style="color:${coin.change>0?'green':'red'};">
                      <i class="fa-solid fa-chart-line"></i>
                      <span>${coin.change}</span>
                  </figcaption>
          </figure>
        </li>
        `
    })
}
