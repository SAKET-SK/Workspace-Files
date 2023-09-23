const form = document.getElementById("bookingForm");
        const travelType = document.getElementById("travelType");
        const dateInput = document.getElementById("date");
        const genderInput = document.getElementById("gender");
        const dateErrorMessage = document.getElementById("dateErrorMessage");
        const genderErrorMessage = document.getElementById("genderErrorMessage");

        const marqueeTexts = [
            "Did you know : Indian Railways is the fourth-largest railway network in the world, covering over 67,000 route kilometers and serving millions of passengers daily.",
            "Did you know : Gorakhpur Junction in Uttar Pradesh has the longest railway platform in the world, spanning approximately 1,366.33 meters.",
            "Did you know : The Delhi-Howrah route is one of the busiest railway routes globally, connecting the capital city, New Delhi, to Kolkata.",
            "Did you know : The Fairy Queen, a steam locomotive built in 1855, is one of the oldest operating steam engines in the world. It was awarded a Guinness World Record in 1998 for its heritage status.",
            "Did you know : The Darjeeling Himalayan Railway also known as the TOY TRAIN, this narrow-gauge railway in West Bengal is a UNESCO World Heritage Site and provides breathtaking views of the Himalayas.",
            "Did you know : The Palace on Wheels is a luxury tourist train offers a royal experience, taking passengers on a week-long journey through Rajasthan, showcasing the state's rich history and culture.",
            "Did you know : Indian Railways introduced Vistadome coaches with panoramic windows, offering passengers stunning views of scenic routes like the Araku Valley in Andhra Pradesh and the Nilgiri Mountain Railway in Tamil Nadu.",
            "Did you know : In 2020, the Ambala Cantt railway station in Haryana was awarded the title of the cleanest railway station in India.",
            "Did you know : Indian Railways has one of the largest fleets of electric locomotives globally, contributing to a reduction in greenhouse gas emissions.",
            "Did you know : In 2018, Indian Railways set a world record when 800 railway employees cleaned a single train in under 5 minutes.",
            "Did you know : The Kalka-Shimla Railway, this narrow-gauge railway in Himachal Pradesh is another UNESCO World Heritage Site and is famous for its winding tracks through picturesque hills.",
            "Did you know : Often referred to as the LIFELINE OF INDIA, the Indian Railways plays a crucial role in transporting goods and people across the vast and diverse country.",
            "Did you know : IRCTC is one of the largest e-commerce websites in Asia, handling online ticketing, catering, and tourism services for Indian Railways.",
            "Did you know : The Rajdhani Express is series of premium, high-speed trains connects major cities in India, providing passengers with comfort and efficiency for long-distance travel.",
            "Did you know : Apart from the Palace on Wheels, India also offers other luxury trains like the Maharajas' Express, the Deccan Odyssey, and the Golden Chariot, providing travelers with opulent experiences."
        ];
        
        function getRandomMarqueeText() {
            const randomIndex = Math.floor(Math.random() * marqueeTexts.length);
            return marqueeTexts[randomIndex];
        }

        window.addEventListener('load', () => {
            const marquee = document.getElementById('marquee-text');
            marquee.textContent = getRandomMarqueeText();
        });

        form.addEventListener("submit", function (e) {
            if (travelType.value === "tatkal") {
                const selectedDate = new Date(dateInput.value);
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);

                if (selectedDate.getTime() !== tomorrow.getTime()) {
                    e.preventDefault();
                    dateErrorMessage.style.display = "block";
                } else {
                    dateErrorMessage.style.display = "none";
                }
            } else {
                dateErrorMessage.style.display = "none";
            }

            if (travelType.value === "ladies" && genderInput.value !== "female") {
                e.preventDefault();
                genderErrorMessage.style.display = "block";
            } else {
                genderErrorMessage.style.display = "none";
            }
        });

        travelType.addEventListener("change", function () {
            if (travelType.value === "tatkal") {
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                dateInput.min = tomorrow.toISOString().split("T")[0];
                dateInput.max = tomorrow.toISOString().split("T")[0];
            } else {
                dateInput.min = "";
                dateInput.max = "";
            }

            if (travelType.value === "ladies") {
                genderInput.value = "female";
                genderInput.disabled = true;
            } else {
                genderInput.disabled = false;
            }
        });