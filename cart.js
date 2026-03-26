

var cart = [];

$(document).ready(function() {
    console.log('🐾 Animal Conference Cart Initialized');

  
    function updateCartUI() {
        var $cartContainer = $('#cartItems');
        var total = 0;

        
        if (cart.length === 0) {
            $cartContainer.html('<p class="text-muted text-center">Your registration is empty</p>');
            $('#cartTotal').text('$0.00');
            return;
        }

        $cartContainer.empty();

        
        cart.forEach(function(item, index) {
            var subtotal = item.price * item.quantity;
            total += subtotal;

            var cartHtml = `
                <div class="cart-item mb-3 border-bottom pb-2">
                    <div class="d-flex justify-content-between">
                        <strong>${item.title}</strong>
                        <button class="btn btn-sm text-danger btn-remove" data-index="${index}">&times;</button>
                    </div>
                    <div class="d-flex justify-content-between align-items-center mt-1">
                        <div class="btn-group btn-group-sm">
                            <button class="btn btn-light border btn-qty-minus" data-index="${index}">-</button>
                            <span class="btn btn-light border disabled">${item.quantity}</span>
                            <button class="btn btn-light border btn-qty-plus" data-index="${index}">+</button>
                        </div>
                        <span class="text-muted">$${subtotal.toFixed(2)}</span>
                    </div>
                </div>
            `;
            $cartContainer.append(cartHtml);
        });

        $('#cartTotal').text('$' + total.toFixed(2));
    }

   


    $(document).on('click', '.btn-add-to-cart', function() {
        
        var id = $(this).data('id');
        var title = $(this).data('title') || "Conference Item";
        var price = parseFloat($(this).data('price')) || 0.00;
        
        var existing = cart.find(i => i.id === id);
        
        if (existing) {
            existing.quantity++;
            console.log('➕ Increased quantity for:', title);
        } else {
            cart.push({ 
                id: id, 
                title: title, 
                price: price, 
                quantity: 1 
            });
            console.log('✅ Added to order:', title);
        }
        
        updateCartUI();
    });

    
    $(document).on('click', '.btn-qty-plus', function() {
        var idx = $(this).data('index');
        cart[idx].quantity++;
        updateCartUI();
    });

  
    $(document).on('click', '.btn-qty-minus', function() {
        var idx = $(this).data('index');
        cart[idx].quantity--;
        
        if (cart[idx].quantity <= 0) {
            cart.splice(idx, 1);
        }
        
        updateCartUI();
    });

   
    $(document).on('click', '.btn-remove', function() {
        var idx = $(this).data('index');
        cart.splice(idx, 1);
        updateCartUI();
    });

   
    $('#checkoutBtn').on('click', function() {
        if (cart.length === 0) {
            alert("Please select a pass or workshop first!");
            return;
        }

        var $btn = $(this);
        $btn.prop('disabled', true).text('Processing...');

        $.ajax({
            url: 'https://jsonplaceholder.typicode.com/posts',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                orderItems: cart,
                orderDate: new Date().toISOString(),
                totalAmount: $('#cartTotal').text()
            })
        })
        .done(function(res) {
            alert('🐾 Registration Successful!\nConfirmation ID: CONF-' + res.id);
            cart = []; 
            updateCartUI();
        })
        .fail(function() {
            alert('Error processing registration. Please try again.');
        })
        .always(function() {
            $btn.prop('disabled', false).text('Complete Registration');
        });
    });
});
