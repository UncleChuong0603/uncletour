import os
import datetime
import sqlite3

from cs50 import SQL
from flask import Flask, flash, redirect, render_template, request, session
from flask_session import Session
from werkzeug.security import check_password_hash, generate_password_hash

from helpers import apology, login_required, lookup, usd

from functools import wraps

# Configure application
app = Flask(__name__)
app.static_folder = 'static'

# Configure session to use filesystem (instead of signed cookies)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# Custom filter
app.jinja_env.filters["usd"] = usd

# Configure CS50 Library to use SQLite database
db = SQL("sqlite:///tour.db")

@app.route("/")
def home():
    return render_template("home.html")

@app.route("/package")
def package():
    return render_template("package.html")

@app.route("/destination")
def destination():
    return render_template("destination.html")

@app.route("/contact")
def contact():
    return render_template("contact.html")

@app.route("/booking")
def booking():
    return render_template("booking.html")

@app.route("/admin")
@login_required
def admin():
    user_id = session["user_id"]
    ask_tour_db = db.execute(
        "SELECT name, phone_number, email, tour, date_of_departure FROM ask_tour_table ORDER BY name"
    )
    booking_db = db.execute(
        "SELECT guest_name, number_of_guest, tour_name, trip_length, date_of_departure, trip_code FROM booking_table ORDER BY guest_name"
    )

    user_db = db.execute(
        "SELECT id, user_name, email FROM user_table"
    )

    subscribe_db = db.execute(
        "SELECT email, subscription_date FROM subscribe_email"
    )
    
    return render_template("admin.html", ask_tour_database=ask_tour_db, booking_database=booking_db, user_database=user_db, subscription_database=subscribe_db)

@app.route("/login", methods=["GET", "POST"])
def login():
    """Log user in"""

    # Forget any user_id
    session.clear()

    # User reached route via POST (as by submitting a form via POST)
    if request.method == "POST":


        # Ensure username was submitted
        if not request.form.get("username"):
            return apology("must provide username", 403)

        # Ensure password was submitted
        elif not request.form.get("password"):
            return apology("must provide password", 403)

        # Query database for username
        rows = db.execute(
            "SELECT * FROM user_table WHERE user_name = ?", request.form.get("username")
        )

        # Ensure username exists and password is correct
        if len(rows) != 1 or not check_password_hash(
            rows[0]["hash"], request.form.get("password")
        ):
            return apology("invalid username and/or password", 403)

        # Remember which user has logged in
        session["user_id"] = rows[0]["id"]

        # Redirect user to home page
        return redirect("/admin")

    # User reached route via GET (as by clicking a link or via redirect)
    else:
        return render_template("login.html")

@app.route("/register", methods=["GET", "POST"])
def register():
    """Register user"""
    if request.method == "GET":
        return render_template("register.html")
    else:
        username = request.form.get("username")
        password = request.form.get("password")
        confirmation = request.form.get("confirm_password")
        email = request.form.get("email")        

        if not username:
            return apology("Must Give Username")

        if not password:
            return apology("Must Give Password")

        if not confirmation:
            return apology("Must Give Confirmation")

        if password != confirmation:
            return apology("Password Do Not Match")

        hash = generate_password_hash(password)

        try:
            # Insert user into the database
            db.execute(
                "INSERT INTO user_table (user_name, hash, email) VALUES (?, ?, ?)", username, hash, email
            )
            # Redirect to the admin page after successful registration
            return redirect("/login")
        except sqlite3.IntegrityError:
            return apology("Username or email already exists")

@app.route("/logout")
def logout():
    """Log user out"""

    # Forget any user_id
    session.clear()

    # Redirect user to login form
    return redirect("/login")



@app.route("/submit_ask_tour", methods=["POST"])
def submit_ask_tour():
    if request.method == "POST":
        name = request.form.get("name")
        phone_number = request.form.get("phone_number")
        email = request.form.get("email")
        tour = request.form.get("tour")
        date_of_departure = request.form.get("date_of_departure")

        # Insert data into the ask_tour_table
        try:
            db.execute(
                "INSERT INTO ask_tour_table (name, phone_number, email, tour, date_of_departure) VALUES (?, ?, ?, ?, ?)",
                name, phone_number, email, tour, date_of_departure
            )
        except Exception as e:
            return apology("An error occurred while submitting the form")

        # Redirect to a success page or the desired location
        return redirect("/")  # Change "/success" to your desired success page route
    else:
        return apology("Method not allowed")
    
@app.route("/submit_booking", methods=["GET", "POST"])
def submit_booking():
    if request.method == "POST":
        date = request.form.get("date")
        guest_name = request.form.get("guest_name")
        number_of_guest = request.form.get("number_of_guest")
        tour_name = request.form.get("tour_name")
        trip_length = request.form.get("trip_length")
        date_of_departure = request.form.get("date_of_departure")
        trip_code = request.form.get("trip_code")

        # Insert data into the booking_table
        try:
            db.execute(
                "INSERT INTO booking_table (date, guest_name, number_of_guest, tour_name, trip_length, date_of_departure, trip_code) VALUES (?, ?, ?, ?, ?, ?, ?)",
                date, guest_name, number_of_guest, tour_name, trip_length, date_of_departure, trip_code
            )
        except Exception as e:
            return apology("An error occurred while submitting the form")

        # Redirect to a success page or the desired location
        return redirect("/")  # Change "/" to your desired route after successful submission
    else:
        # Handle GET request (displaying the form)
        return render_template("booking.html")  # Replace with your booking form template



def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if "user_id" not in session:
            return redirect("/login")
        return f(*args, **kwargs)

    return decorated_function

@app.after_request
def after_request(response):
    """Ensure responses aren't cached"""
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response

@app.route('/subscribe', methods=['POST'])
def subscribe():
    if request.method == 'POST':
        email = request.form['email']

        # Insert the submitted email into the database
        try:
            # Insert user into the database
            db.execute(
                "INSERT INTO subscribe_email (email) VALUES (?)", email
            )
            # Redirect to the admin page after successful registration
            return redirect("/")
        except sqlite3.IntegrityError:
            return apology("Invalid Email")


if __name__ == '__main__':
    app.run(debug=True)