document.addEventListener("DOMContentLoaded", function() {
    const headers = document.querySelectorAll("header");
    const menu = document.querySelector('#menu-icon');
    const navbar = document.querySelector('.navbar');

    // Add 'sticky' class to headers on scroll
    headers.forEach(header => {
        window.addEventListener("scroll", function() {
            header.classList.toggle("sticky", window.scrollY > 0);
        });
    });

    // Toggle menu and navbar on menu icon click
    menu.addEventListener('click', () => {
        menu.classList.toggle('bx-x');
        navbar.classList.toggle('open');
    });

    // Close menu on scroll
    window.addEventListener('scroll', () => {
        menu.classList.remove('bx-x');
        navbar.classList.remove('open');
    });

    // Get the 'Ask for Tour Information' link and its corresponding popup
    const askForTourLink = document.querySelector('.ask-tour-btn');
    const asktourPopup = document.getElementById('asktourPopup');

    // Initially hide the popup
    asktourPopup.style.display = 'none';

    // Show 'Ask for Tour Information' popup on link click
    askForTourLink.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent default link behavior (optional)
        asktourPopup.style.display = 'flex'; // Show the asktourPopup
    });

    // Close 'Ask for Tour Information' popup on close button click
    const closeBtn = document.getElementById('closeBtnAsktour');
    closeBtn.addEventListener('click', function() {
        asktourPopup.style.display = 'none'; // Hide the asktourPopup
    });

    // Get the 'Booking' popup and close button
    const bookingPopup = document.getElementById('bookingPopup');
    const closeBtnBooking = document.getElementById('closeBtnBooking'); // Update this ID if needed

    // Initially hide the popup
    bookingPopup.style.display = 'none';

    // Function to show booking popup
    function showBookingPopup() {
        bookingPopup.style.display = 'flex'; // Show the bookingPopup
    }

    // Function to close booking popup
    function closeBookingPopup() {
        bookingPopup.style.display = 'none'; // Hide the bookingPopup
    }

    // Function to change tour preview image and update the tour name
    function changeTourPreview(imageUrl) {
        // Extract the relative path from the absolute URL
        const relativePath = imageUrl.replace('http://127.0.0.1:5000/', '');
    
        document.getElementById('tourPreview').src = imageUrl;
    
        let tourName = '';
        switch (relativePath) {
            case 'static/img/img1.jpg':
                tourName = 'London';
                break;
            case 'static/img/img2.jpg':
                tourName = 'New York';
                break;
            case 'static/img/img3.jpg':
                tourName = 'Dubai';
                break;
            // Add more cases for other thumbnail images if needed
            default:
                tourName = 'Tour Name';
                break;
        }
    
        const bookingContentH2 = document.querySelector('.booking-content h2');
        if (bookingContentH2) {
            bookingContentH2.textContent = tourName;
            console.log('Tour Name Updated:', tourName);
        } else {
            console.log('H2 Element Not Found!');
        }

        const bookingContentTripCode = document.querySelector('.booking-content .trip-code');
        if (bookingContentTripCode) {
            bookingContentTripCode.textContent = 'Trip code: '+tourName;
            console.log('Tour Name Updated:', tourName);
        } else {
            console.log('trip-code Element Not Found!');
        }
    }

    // Function to change tour preview image and show booking popup
    function handleThumbnailClick(thumbnail) {
        const thumbnailImageSrc = thumbnail.querySelector('img').src;
        const tourPreviewImg = document.getElementById('tourPreview');
        tourPreviewImg.src = thumbnailImageSrc;
        
        // Call changeTourPreview to update the tour name
        changeTourPreview(thumbnailImageSrc);

        showBookingPopup(); // Show booking popup when .thum is clicked
    }

    // Get all .thum elements
    const thumbnails = document.querySelectorAll('.thum');

    // Loop through each .thum element and attach a click event listener
    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', function() {
            handleThumbnailClick(this); // Handle thumbnail click (change image and show popup)
        });
    });

    // Close booking popup on close button click
    closeBtnBooking.addEventListener('click', function() {
        closeBookingPopup(); // Close booking popup when close button is clicked
    });


    // Get the 'topBtn' element
    const topBtn = document.getElementById("topBtn");

    // Function to control button display on scrolling and scroll back to top
    function scrollFunction() {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            topBtn.style.display = "block";
        } else {
            topBtn.style.display = "none";
        }
    }

    // Assign scroll event listener to window
    window.addEventListener("scroll", function() {
        scrollFunction();
        asktourPopup.style.display = 'none'; // Hide the 'Ask for Tour Information' popup on scroll
    });

    // Scroll to top when 'topBtn' is clicked
    topBtn.addEventListener("click", function() {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    });

    const pageProgressBar = document.querySelector(".progress-bar");
    const scrollContainer = () => document.documentElement; // Assuming you want to track scrolling in the whole document

    document.addEventListener("scroll", () => {
        const scrolledPercentage =
            (scrollContainer().scrollTop /
                (scrollContainer().scrollHeight - scrollContainer().clientHeight)) *
            100;

        pageProgressBar.style.width = `${scrolledPercentage}%`;
    });

    // Function to show category content and hide others
    function showCategory(category) {
        // Hide all elements first
        const allElements = document.querySelectorAll('.shipCruises, .foodTour, .summerRest, .mountainTour');
        allElements.forEach(element => {
            element.style.display = 'none';
        });

        // Show content based on the selected category
        const elementsToShow = document.querySelectorAll('.' + category);
        elementsToShow.forEach(element => {
            element.style.display = 'block';
        });
    }

    // Event listeners for category selection
    const categoryButtons = document.querySelectorAll('.category-btn');

    categoryButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            const category = event.target.dataset.category;
            showCategory(category);
        });
    });

    // Function to toggle visibility of all elements
    function toggleAllElements() {
        const categoryContent = document.querySelector('.category-content');
        const allElements = categoryContent.querySelectorAll('.package-content-category > div');
        
        allElements.forEach(element => {
            element.style.display = 'block';
        });
    }

    // Event listener for the button click
    document.getElementById('viewAllButton').addEventListener('click', toggleAllElements);
    
    document.getElementById('view-all-package').addEventListener('click', function(event) {
        event.preventDefault(); // Prevent the default behavior of the link
        window.location.href = 'http://127.0.0.1:5000/package'; // Redirect to the desired URL
    });

    document.getElementById('home-logo').addEventListener('click', function(event) {
        event.preventDefault(); // Prevent the default behavior of the link
        window.location.href = 'http://127.0.0.1:5000'; // Redirect to the homepage URL
    });

    document.getElementById('view-all-destination').addEventListener('click', function(event) {
        event.preventDefault(); // Prevent the default behavior of the link
        window.location.href = 'http://127.0.0.1:5000/destination'; // Redirect to the desired URL
    });
    
    // Get the table and footer elements
    const table = document.querySelector('.user-table');
    const footer = document.getElementById('contact');

});

