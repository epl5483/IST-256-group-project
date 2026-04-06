import React, { useEffect, useState } from "react";

const STORAGE_KEY = "conference_session";

function SessionCart() {
  const [sessions, setSessions] = useState([]);
  const [filterQuery, setFilterQuery] = useState("");
  const [cart, setCart] = useState([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    setSessions(stored);
  }, []);

  const filteredSessions = sessions.filter((s) => {
    const q = filterQuery.toLowerCase();
    return (
      (s.sessionTitle || "").toLowerCase().includes(q) ||
      (s.speaker || "").toLowerCase().includes(q) ||
      (s.sessionID || "").toLowerCase().includes(q)
    );
  });

  const addToCart = (session) => {
    const cleanPrice =
      parseFloat((session.registrationFee || "").replace(/[^0-9.]/g, "")) || 0;

    setCart((prev) => {
      const existing = prev.find((i) => i.id === session.sessionID);
      if (existing) {
        return prev.map((item) =>
          item.id === session.sessionID
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          id: session.sessionID,
          title: session.sessionTitle,
          price: cleanPrice,
          quantity: 1,
        },
      ];
    });
  };

  const updateQuantity = (index, delta) => {
    setCart((prev) => {
      const updated = [...prev];
      updated[index].quantity += delta;
      if (updated[index].quantity <= 0) {
        updated.splice(index, 1);
      }
      return updated;
    });
  };

  const removeItem = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert("Please select a pass or workshop first!");
      return;
    }

    setIsCheckingOut(true);

    try {
      const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderItems: cart,
          orderDate: new Date().toISOString(),
          totalAmount: totalAmount,
        }),
      });

      if (!res.ok) throw new Error("Network error");

      const data = await res.json();
      alert("Registration Successful!\nConfirmation ID: CONF-" + data.id);
      setCart([]);
    } catch (err) {
      alert("Error processing registration.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="container my-4">
      <h2 className="mb-3">Conference Sessions & Registration</h2>

      <div className="row">
        <div className="col-md-7">
          <div className="mb-3">
            <input
              id="searchInput"
              type="text"
              className="form-control"
              placeholder="Search sessions by title, speaker, or ID..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
            />
          </div>

          <div id="productList">
            {filteredSessions.length === 0 ? (
              <p className="text-muted">No matching sessions found.</p>
            ) : (
              filteredSessions.map((session) => {
                const cleanPrice =
                  parseFloat(
                    (session.registrationFee || "").replace(/[^0-9.]/g, "")
                  ) || 0;

                return (
                  <div
                    className="card mb-3 p-3 shadow-sm border-0"
                    key={session.sessionID}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h5 className="m-0">
                          {session.sessionTitle || "Untitled Session"}
                        </h5>
                        <small className="text-muted">
                          Speaker: {session.speaker || "Unknown"} | ID:{" "}
                          {session.sessionID || "N/A"}
                        </small>
                        <p className="m-0 mt-1 small">
                          {(session.workshop || "Workshop") +
                            " (" +
                            (session.duration || "Duration N/A") +
                            ")"}
                        </p>
                      </div>
                      <div className="text-end">
                        <p className="price-text m-0 mb-2">
                          ${cleanPrice.toFixed(2)}
                        </p>
                        <button
                          className="btn btn-primary"
                          onClick={() => addToCart(session)}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="col-md-5">
          <h4>Your Registration</h4>
          <div id="cartItems" className="mt-3">
            {cart.length === 0 ? (
              <p className="text-muted text-center">
                Your registration is empty
              </p>
            ) : (
              cart.map((item, index) => {
                const subtotal = item.price * item.quantity;
                return (
                  <div
                    className="cart-item mb-3 border-bottom pb-2"
                    key={item.id}
                  >
                    <div className="d-flex justify-content-between">
                      <strong>{item.title}</strong>
                      <button
                        className="btn btn-sm text-danger"
                        onClick={() => removeItem(index)}
                      >
                        &times;
                      </button>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mt-1">
                      <div className="btn-group btn-group-sm">
                        <button
                          className="btn btn-light border"
                          onClick={() => updateQuantity(index, -1)}
                        >
                          -
                        </button>
                        <span className="btn btn-light border disabled">
                          {item.quantity}
                        </span>
                        <button
                          className="btn btn-light border"
                          onClick={() => updateQuantity(index, 1)}
                        >
                          +
                        </button>
                      </div>
                      <span className="text-muted">
                        ${subtotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="mt-3 d-flex justify-content-between align-items-center">
            <strong>Total:</strong>
            <span id="cartTotal">${totalAmount.toFixed(2)}</span>
          </div>

          <button
            id="checkoutBtn"
            className="btn btn-success w-100 mt-3"
            onClick={handleCheckout}
            disabled={isCheckingOut}
          >
            {isCheckingOut ? "Processing..." : "Complete Registration"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SessionCart;

