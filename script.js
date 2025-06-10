// Splash Screen Animation
document.addEventListener('DOMContentLoaded', function () {
    const splashScreen = document.getElementById('splash-screen');
    const progressBar = document.querySelector('.progress-bar');
    const terminalLines = document.querySelectorAll('.terminal-line');
        // GitHub Feed Functionality
        async function fetchGitHubData() {
            try {
                // Fetch user data
                const userResponse = await fetch('https://api.github.com/users/adityasasidhar');
                const userData = await userResponse.json();

                // Fetch events data
                const eventsResponse = await fetch('https://api.github.com/users/adityasasidhar/events/public');
                const eventsData = await eventsResponse.json();

                // Update stats
                document.getElementById('total-repos').textContent = userData.public_repos;

                // Process events to get commit count, PRs, etc.
                let commitCount = 0;
                let prCount = 0;
                let starCount = 0;

                eventsData.forEach(event => {
                    if (event.type === 'PushEvent') {
                        commitCount += event.payload.commits.length;
                    } else if (event.type === 'PullRequestEvent') {
                        prCount++;
                    } else if (event.type === 'WatchEvent') {
                        starCount++;
                    }
                });

                document.getElementById('total-commits').textContent = commitCount;
                document.getElementById('total-prs').textContent = prCount;
                document.getElementById('total-stars').textContent = starCount;

                // Display recent activity (last 5 events)
                const activityFeed = document.getElementById('activity-feed');
                activityFeed.innerHTML = '';

                const recentEvents = eventsData.slice(0, 5);

                recentEvents.forEach(event => {
                    const activityItem = document.createElement('div');
                    activityItem.className = 'activity-item';

                    let icon = '';
                    let type = '';
                    let repo = event.repo.name.split('/')[1];
                    let date = new Date(event.created_at).toLocaleDateString();

                    switch(event.type) {
                        case 'PushEvent':
                            icon = '<i class="fa-solid fa-code-commit"></i>';
                            type = `Pushed ${event.payload.commits.length} commit${event.payload.commits.length > 1 ? 's' : ''}`;
                            break;
                        case 'PullRequestEvent':
                            icon = '<i class="fa-solid fa-code-pull-request"></i>';
                            type = `${event.payload.action} pull request`;
                            break;
                        case 'WatchEvent':
                            icon = '<i class="fa-solid fa-star"></i>';
                            type = 'Starred repository';
                            break;
                        case 'CreateEvent':
                            icon = '<i class="fa-solid fa-plus"></i>';
                            type = `Created ${event.payload.ref_type}`;
                            break;
                        case 'ForkEvent':
                            icon = '<i class="fa-solid fa-code-fork"></i>';
                            type = 'Forked repository';
                            break;
                        default:
                            icon = '<i class="fa-solid fa-code"></i>';
                            type = event.type;
                    }

                    activityItem.innerHTML = `
                        <div class="activity-icon">${icon}</div>
                        <div class="activity-details">
                            <div class="activity-type">${type} in <span class="activity-repo">${repo}</span></div>
                            <div class="activity-date">${date}</div>
                        </div>
                    `;

                    activityFeed.appendChild(activityItem);
                });

            } catch (error) {
                console.error('Error fetching GitHub data:', error);
                document.getElementById('github-feed').innerHTML = `
                    <div class="container">
                        <h1 class="sub-title">My GitHub Activity</h1>
                        <p style="text-align: center; color: #ff004f;">Unable to load GitHub data at this time.</p>
                    </div>
                `;
            }
        }

        // Call the function
        fetchGitHubData();




    // Animate terminal lines
    terminalLines.forEach((line, index) => {
        setTimeout(() => {
            line.style.opacity = '1';
            line.style.transform = 'translateY(0)';
        }, 500 * (index + 1));
    });

    // Animate progress bar
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress >= 100) {
            progress = 100;
            clearInterval(progressInterval);

            // Hide splash screen after delay
            setTimeout(() => {
                splashScreen.style.opacity = '0';
                setTimeout(() => {
                    splashScreen.style.display = 'none';
                    // Initialize Three.js after splash screen disappears
                    initThreeJSBackground();
                }, 1000);
            }, 500);
        }
        progressBar.style.width = `${progress}%`;
        document.querySelector('.progress-text').textContent = `${Math.round(progress)}%`;
    }, 100);

    // Initialize custom cursor
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');

    // Track mouse position
    let mouseX = 0, mouseY = 0;
    let posX = 0, posY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Smooth cursor animation
    function updateCursor() {
        posX += (mouseX - posX) / 5;
        posY += (mouseY - posY) / 5;

        cursor.style.left = `${posX}px`;
        cursor.style.top = `${posY}px`;

        cursorFollower.style.left = `${mouseX}px`;
        cursorFollower.style.top = `${mouseY}px`;

        requestAnimationFrame(updateCursor);
    }

    updateCursor();

    // Cursor hover effects
    const hoverElements = document.querySelectorAll('a, button, .tab-links, .work, input, textarea');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(1.5)';
            cursor.style.backgroundColor = 'rgba(255, 0, 79, 0.5)';
            cursor.style.borderColor = 'transparent';
            cursorFollower.style.transform = 'scale(2)';
        });

        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursor.style.backgroundColor = 'transparent';
            cursor.style.borderColor = '#ff004f';
            cursorFollower.style.transform = 'scale(1)';
        });
    });

    // Scroll animations
    const scrollElements = document.querySelectorAll('.scroll-animation');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, { threshold: 0.1 });

    scrollElements.forEach(el => observer.observe(el));

    // Tab functionality
    function opentab(tabname) {
        const tablinks = document.getElementsByClassName("tab-links");
        for (let i = 0; i < tablinks.length; i++) {
            tablinks[i].classList.remove("active-link");
        }

        const tabcontents = document.getElementsByClassName("tab-contents");
        for (let i = 0; i < tabcontents.length; i++) {
            tabcontents[i].classList.remove("active-tab");
        }

        event.currentTarget.classList.add("active-link");
        document.getElementById(tabname).classList.add("active-tab");
    }


    // Typing effect
    const typingElement = document.querySelector(".typing-effect");
    const texts = ["A Software Developer.", "A CS Student.", "A Human."];
    let index = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingSpeed = 60;
    const deletingSpeed = 65;
    const delayBetweenTexts = 600;
    const delayBeforeDeleting = 1000;

    function type() {
        const currentText = texts[index];

        if (!isDeleting && charIndex < currentText.length) {
            typingElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            setTimeout(type, typingSpeed);
        } else if (isDeleting && charIndex > 0) {
            typingElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            setTimeout(type, deletingSpeed);
        } else if (!isDeleting && charIndex === currentText.length) {
            setTimeout(() => {
                isDeleting = true;
                type();
            }, delayBeforeDeleting);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            index = (index + 1) % texts.length;
            setTimeout(type, delayBetweenTexts);
        }
    }

    setTimeout(type, 1000);

    // Form submission
    const scriptURL = 'https://script.google.com/macros/s/AKfycbzAOcBA4M9ZNiW709so-2tWpugf-O2V32TbN6je8VNrsMc7RO4ba7giwuEZe2gVPDr5/exec';
    const form = document.forms['submit-to-google-sheet'];

    form.addEventListener('submit', e => {
        e.preventDefault();
        fetch(scriptURL, { method: 'POST', body: new FormData(form) })
            .then(response => {
                alert('Message sent successfully!');
                form.reset();
            })
            .catch(error => console.error('Error!', error.message));
    });

    // Button Fix
const tabButtons = document.querySelectorAll('.tab-links');

tabButtons.forEach(button => {
    button.addEventListener('click', function (e) {
        const tabText = this.textContent.trim().toLowerCase();
        let tabName = '';

        if (tabText.includes('educational experience')) {
            tabName = 'education';
        } else if (tabText.includes('real life experience')) {
            tabName = 'experience';
        } else if (tabText.includes('skills')) {
            tabName = 'skills';
        }

        if (tabName) {
            opentab(tabName);
        } else {
            console.error('Tab name could not be matched.');
        }
    });
});

// Mobile menu functionality
window.openmenu = function() {
    document.getElementById("sidemenu").style.right = "0";
    document.getElementById("menu-close").style.display = "block";
    document.getElementById("menu-bars").style.display = "none";
}

window.closemenu = function() {
    document.getElementById("sidemenu").style.right = "-200px";
    document.getElementById("menu-close").style.display = "none";
    document.getElementById("menu-bars").style.display = "block";
}

});
