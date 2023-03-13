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
        
        console.log(db.product)
        html += `
        <div class="product">
            
            <div class="product_img">
                <img src="${product.image}" alt="imagen" />
            </div>
            
            <div class="product_info">
            <h4>${product.name} <span><b>Stock</b>: ${product.quantity}<span></h4>
               <h5>
                   $${product.price}
                   <i class='bx bx-plus plus'></i>
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

            console.log(db.cart);
        };
        
    });
   

};


function paintCartProduct (db) {
    
    const cartProducts= document.querySelector(".cart_products");

    let html = "" ;
    
    for (const product in db.cart) {
        
       const {quantity,price,name,image,id,amount } = db.cart[product];
    
       console.log({quantity,price,name,image,id,amount });

       html += `
                <div class="cart_product">
                    <div class="cart_product--img">
                       <img src="${image}" alt= "imagen" >
                    </div>
                    <div class="cart_product_body">
                        <h4><b>${name}</b></h4>
                        <p id="cart-product-p"><span id="stock_cart">Stock: ${quantity} </span>| $ ${price}</p>
                        <p id="cart-product-p">Subtotal: $10.00</p> 
                        <div class="cart_product_icon">
                            <i class='bx bx-minus'></i>
                            <span>${amount} unit</span>
                            <i class='bx bx-plus' ></i>
                            <i class='bx bx-trash' ></i>
                        </div>
                    </div>

                </div>     
            `;
        
       
        };
        cartProducts.innerHTML = html;

}




async function main() {
    const db = { 
                products:
                       JSON.parse(window.localStorage.getItem("products")) || (await getProducts()),
                cart: JSON.parse(window.localStorage.getItem("cart")) || {},
             };
    
    
    printProducts(db);
    handleCart();
    addCartFrom(db);
    paintCartProduct (db);


        
};
    


main();