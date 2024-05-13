document.addEventListener('DOMContentLoaded', function() {
    const tooltip = document.getElementById('tooltip');

    fetch('events.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const calendarEvents = data.map(event => ({
                title: event.notes,
                start: event.startDate,
                end: event.endDate,
                color: '#' + Math.floor(Math.random()*16777215).toString(16), // Generate a random color
                extendedProps: {
                    notes: event.notes
                }
            }));

            var calendarEl = document.getElementById('calendar');
            var calendar = new FullCalendar.Calendar(calendarEl, {
                contentHeight: 'auto',
                headerToolbar: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,listMonth'
                },
                initialView: 'dayGridMonth',
                events: calendarEvents,
                navLinks: true,
                editable: false,
                dayCellDidMount: function(cellInfo) {
                    if (cellInfo.date.getDay() === 6 || cellInfo.date.getDay() === 0) {
                        cellInfo.el.classList.add('fc-day-sat', 'fc-day-sun');
                    }
                },
                eventDidMount: function(info) {
                    info.el.addEventListener('mouseover', function(event) {
                        const tooltipWidth = tooltip.offsetWidth;
                        const tooltipHeight = tooltip.offsetHeight;
                        const pageWidth = window.innerWidth;
                        const pageHeight = window.innerHeight;

                        // Adjust position to keep tooltip inside viewport
                        let left = event.pageX + 10;
                        let top = event.pageY + 10;

                        if (left + tooltipWidth > pageWidth) {
                            left = event.pageX - tooltipWidth - 10;
                        }
                        if (top + tooltipHeight > pageHeight) {
                            top = event.pageY - tooltipHeight - 10;
                        }

                        tooltip.style.display = 'block';
                        tooltip.style.left = left + 'px';
                        tooltip.style.top = top + 'px';
                        tooltip.textContent = info.event.extendedProps.notes;
                    });

                    info.el.addEventListener('mouseout', function() {
                        tooltip.style.display = 'none';
                    });
                }

            });
            calendar.render();
        })
        .catch(error => {
            console.error('Error fetching event data:', error);
            alert("Please fetch the time off requests and approvals and make sure they are saved as events.json in the repository directory.");
        });
});