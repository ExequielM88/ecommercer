async function getProducts() {
    try {
        const data = await fetch(
            "https://ecommercebackend.fundamentos-29.repl.co/"
        );

        const res = await data.json();

        window.localStorage.setItem("products",JSON.stringify(res));

        return res;
    } catch (error) {
        console.log(error);
    };
};

function printProducts(db) {
    const productsHTML=document.querySelector(".products");

    let html = "";

    for (const product of db.products) {
        
        
        html += `
        <div class="product">
            
            <div class="product_img">
                <img src="${product.image}" alt="imagen" />
            </div>
            
            <div class="product_info">
            <h4>${product.name} <span><b>Stock</b>: ${product.quantity}<span></h4>
               <h5>
                   $${product.price}
                   ${product.quantity 
                    ? `<i class='bx bx-plus plus' id="${product.id}"></i>`
                   :"<span class='sold-out'>Sold out</span> "
                   }
               </h5>
            </div>

        </div>
        `;
    }
    
    

    productsHTML.innerHTML = html;
};

function handleCart(){
    
    const iconCardHTML= document.querySelector("#iconShowCart");
    const cardHTML= document.querySelector(".cart");
    
    
    
    
    iconCardHTML.addEventListener("click" , function () {
        cardHTML.classList.toggle("cart_show")
      
    });

    const closeHTML=document.querySelector("#close-cart");
    
    closeHTML.addEventListener("click" , function () {
        cardHTML.classList.toggle("cart_show")
        
    });
    
};

function  addCartFrom(db) {
    
     
    const productsHTML = document.querySelector(".products");
   
    productsHTML.addEventListener("click", function (e) {
        if (e.target.classList.contains("bx-plus")){
            const id = Number (e.target.id);
    
            

           const productFind = db.products.find ( (product) => product.id === id);
           console.log(productFind)

        
            if (db.cart[productFind.id]) {
                if (productFind.quantity === db.card[productFind.id].amount)
                    return alert("no tenemos mas de este producto en stock")
    
                    db.cart[productFind.id].amount++;
                
            } else {
                    db.cart[productFind.id] = {...productFind , amount:1};
                
            }
            
            window.localStorage.setItem("cart" , JSON.stringify(db.cart));

            printCartProduct(db);
            productAndTotalCart(db);
            totalAmountProducts (db)
        };
        
    });
   

};



function printCartProduct (db) {
    
    const cartProducts= document.querySelector(".cart_products");

    let html = "" ;
    
    for (const product in db.cart) {
        
       const {quantity,price,name,image,id,amount } = db.cart[product];
    
       console.log({quantity,price,name,image,id,amount });

       html += `
                <div class="cart_product" >
                    <div class="cart_product--img">
                       <img src="${image}" alt= "imagen" >
                    </div>
                    <div class="cart_product_body" id="${id}" >
                        <h4><b>${name}</b></h4>
                        <p id="cart-product-p"><span id="stock_cart">Stock: ${quantity} </span>| $ ${price}</p>
                        <p id="cart-product-p">Subtotal: $10.00</p> 
                        <div class="cart_product_icon" id="${id}" >
                            <i class='bx bx-minus' ></i>
                            <span>${amount} unit</span>
                            <i class='bx bx-plus pluss' ></i>
                            <i class='bx bx-trash' ></i>
                        </div>
                    </div>

                </div>     
            `;
        
       
        };
        cartProducts.innerHTML = html;

}
function agreeAndRemoveCart(db){
    const cartProducts= document.querySelector(".cart_products");
    

    cartProducts.addEventListener("click" , function(e) {
        if (e.target.classList.contains("bx-plus")){
            const id = Number(e.target.parentElement.id);
           
            const productFind = db.products.find ( (product) => product.id === id);
            
            if (productFind.quantity === db.cart[productFind.id].amount)
                return alert("no tenemos mas de este producto en stock");
            db.cart[id].amount++;
                
        };
        if (e.target.classList.contains("bx-minus")) {
            const id = Number(e.target.parentElement.id);
            
            if (db.cart[id].amount === 1) {
                delete db.cart[id]
            }else {
                db.cart[id].amount--;
            }
            
        };
    
        if (e.target.classList.contains("bx-trash")){
            const id = Number(e.target.parentElement.id);
            delete db.cart[id];
        };
    
        window.localStorage.setItem("cart" , JSON.stringify(db.cart));
        printCartProduct(db);
        productAndTotalCart(db)
        totalAmountProducts (db)
        
    });
}

function productAndTotalCart(db) {
    const infoTotal = document.querySelector(".item-amount");
    const dinnerAmount =  document.querySelector(".dinner-amount")
    

    let totalProduct = 0
    let amountProducts = 0

    for (const product in db.cart) {
        const { amount, price}  = db.cart[product];
        totalProduct += price * 
        amount;
        amountProducts += db.cart[product].amount;
    }

    infoTotal.textContent = amountProducts + " Item";
    dinnerAmount.textContent = "$"+totalProduct+".00";
    
}

function buyProductCar (db){
    const btnBuy = document.querySelector(".btn_button");

    btnBuy.addEventListener("click" , function () {
        
        if (Object.values(db.cart).lenght) return alert("No tienes nada en tu carrito");
        const response  = confirm("seguro que quieres comprar");
        if(!response) return;

        const currentProducts = [];

        for (const product of db.products) {
            const productCart = db.cart[product.id];
            if (product.id === productCart?.id) {
                currentProducts.push({
                    ...product,
                    quantity: product.quantity - productCart.amount
                });
            } else{
                currentProducts.push(product)
            }
            
        }

        db.products= currentProducts;
        db.cart = {};

        window.localStorage.setItem("products", JSON.stringify(db.products));
        window.localStorage.setItem("cart", JSON.stringify(db.cart));
        productAndTotalCart(db)
        printCartProduct(db);
        printProducts(db);
        
    });

};

function totalAmountProducts (db){
    const amountProducts = document.querySelector(".totalAmountProducts")
    
    let amount = 0;
    for (const product in db.cart) {
        amount += db.cart[product].amount;
    };
    
    amountProducts.textContent = amount;
};


async function main() {
    const db = { 
                products:
                       JSON.parse(window.localStorage.getItem("products")) || (await getProducts()),
                cart: JSON.parse(window.localStorage.getItem("cart")) || {},
             };
    
    
    printProducts(db);
    handleCart();
    addCartFrom(db);
    printCartProduct(db);
    agreeAndRemoveCart(db);
    productAndTotalCart(db);
    buyProductCar (db);
    totalAmountProducts (db);

    /*const iconNavBar= document.querySelector(".handleIconNavbar");
    const navHomeHTML= document.querySelector(".navbar_menu");
    
    iconNavBar.addEventListener("click" , function() {
        navHomeHTML.classList.toggle("nav-bar_show")

    });
    
    const closeHTML=document.querySelector("#close-cart1");

    closeHTML.addEventListener("click" , function () {
        navHomeHTML.classList.toggle("nav-bar_show")
        
    });*/
    
};
    


main();