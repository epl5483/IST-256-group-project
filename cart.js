var cart = [];
const STORAGE_KEY = 'conference_session';

$(document).ready(function() {
    displayProductsFromStorage();

    function displayProductsFromStorage() {
        const $productList = $('#productList');
        const sessions = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

        $productList.empty();

        if (sessions.length === 0) {
            $productList.html('<p class="text-muted">No sessions available. Please add them in the Sessions page.</p>');
            return;
        }

        sessions.forEach((session) => {
            let cleanPrice = session.registrationFee.replace(/[^0-9.]/g, '');
            
            var productHtml = `
                <div class="card mb-3 p-3 shadow-sm border-0">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h5 class="m-0">${session.sessionTitle}</h5>
                            <small class="text-muted">Speaker: ${session.speaker} | ID: ${session.sessionID}</small>
                            <p class="m-0 mt-1 small">${session.workshop} (${session.duration})</p>
                        </div>
                        <div class="text-end">
                            <p class="price-text m-0 mb-2">$${parseFloat(cleanPrice).toFixed(2)}</p>
                            <button class="btn btn-primary btn-add-to-cart" 
                                    data-id="${session.sessionID}" 
                                    data-title="${session.sessionTitle}" 
                                    data-price="${cleanPrice}">
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            `;
            $productList.append(productHtml);
        });
    }

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
                </div>`;
            $cartContainer.append(cartHtml);
        });
        $('#cartTotal').text('$' + total.toFixed(2));
    }

    $(document).on('click', '.btn-add-to-cart', function() {
        var id = $(this).data('id');
        var title = $(this).data('title');
        var price = parseFloat($(this).data('price')) || 0;
        var existing = cart.find(i => i.id === id);
        if (existing) { existing.quantity++; } 
        else { cart.push({ id, title, price, quantity: 1 }); }
        updateCartUI();
    });

    $(document).on('click', '.btn-qty-plus', function() {
        cart[$(this).data('index')].quantity++;
        updateCartUI();
    });

    $(document).on('click', '.btn-qty-minus', function() { 
        var idx = $(this).data('index');
        cart[idx].quantity--;
        if (cart[idx].quantity <= 0) cart.splice(idx, 1);
        updateCartUI(); 
    });

    $(document).on('click', '.btn-remove', function() {
        cart.splice($(this).data('index'), 1);
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
            alert('Error processing registration.');
        })
        .always(function() {
            $btn.prop('disabled', false).text('Complete Registration');
        });
    });
});
