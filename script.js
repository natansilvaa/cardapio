const menu = document.getElementById("menu")
const cartBtn =document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn =document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addresswarn = document.getElementById("address-warn")


let cart = [];

//ABRIR O MODAL DO CARRINHO
cartBtn.addEventListener('click', function(){
    updateCartModal();
    cartModal.style.display ='flex'
    
})

//FECHAR O MODAL DO CARRINHO
cartModal.addEventListener("click", function(event){
if(event.target === cartModal){
    cartModal.style.display = "none";
}
})

closeModalBtn.addEventListener('click', function(){
    cartModal.style.display = "none"
})


menu.addEventListener("click", function(event){


    let parentButton = event.target.closest(".add-to-cart-btn")

    if(parentButton){
        const name = parentButton.getAttribute("data-name") 
        const price = parseFloat(parentButton.getAttribute("data-price"))
        addTocart(name, price)
    }
})





//FUNÇÃO PARA ADD NO CARRINHO
function addTocart(name,price){
    const existingItem = cart.find(item => item.name === name)

    if(existingItem){
     existingItem.quantity+=1;
    }else{
        cart.push({
            name,
            price,
            quantity: 1,
        })
    
    }
    
    updateCartModal()
}


function updateCartModal(){
    cartItemsContainer.innerHTML ="";
    let total =0;

    cart.forEach(item => {
        const cartItemElemente = document.createElement("div");
        cartItemElemente.classList.add("flex", "justify-between","mb-4", "flex-col")

        cartItemElemente.innerHTML=`
         <div class="flex items-center justify-between">
            <div>
                <p class="font-medium">${item.name}</p>
                <p>quantidade: ${item.quantity}</p>
                <p class="font-medium mt-2"> R$ ${item.price.toFixed(2)}</p>
            </div>
            <div>
                <button class="remove-from-cart-btn" data-name="${item.name}">
                    Remover
                </button>
            </div>
         </div>
        `

        total += item.price * item.quantity;

        cartItemsContainer.appendChild(cartItemElemente)
       
    })

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    cartCounter.innerHTML = cart.length;

}


//FUNÇAO DE REMOVER

cartItemsContainer.addEventListener("click", function(event){
    if(event.target.classList.contains("remove-from-cart-btn")){
        const name = event.target.getAttribute("data-name")

        removeItemCart(name);
    }
})

function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name);

    if(index !== -1){
        const item = cart[index];

        if(item.quantity > 1){
            item.quantity -= 1;
            updateCartModal();
            return;
        }

        cart.splice(index, 1);
        updateCartModal();
    }
}

addressInput.addEventListener("input", function(event){
    let inputValue = event.target.value;

    if(inputValue !== ""){
        addressInput.classList.remove("border-red-500")
        addresswarn.classList.add("hidden")
    }
})

checkoutBtn.addEventListener("click", function(){

    const isOpen = checkRestaurantOpen();
    if(!isOpen){
       alert("RESTAURANTE FECHADO NO MOMENTO!!!")
        return;
    }

    if(cart.length === 0) return;
    if(addressInput.value === ""){
        addresswarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return;
    }

    //ENVIAR PEDIDO PARA O WHATS

    const cartItems = cart.map((item) => {
        return (
            ` ${item.name} Quantidade: (${item.quantity}) Preço: R$${item.price} |`
        )
    }).join("")

    const message = encodeURIComponent(cartItems)
    const phone = "92985228991"

    window.open(`http://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank")

    cart =[]
    updateCartModal();
})

//VERIFICAR A DATA E MANIPULAR O CARD HORÁRIO

function checkRestaurantOpen(){
    const date = new Date();
    const hora = date.getHours();
    return hora >= 18 && hora < 22;
    //restaurante aberto
}


const spanItem = document.getElementById("date-span")
const isOpen = checkRestaurantOpen();

if(isOpen){
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600")
}else{
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-500");
}