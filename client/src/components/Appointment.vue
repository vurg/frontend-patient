<template>
    <div class="m-3">
        <div class=" mb-4">
            <div class="card">
                <div class="card-body text-white mailbox-widget pb-0" style="background-color: #567890;">
                    <h2 class="text-white pb-3">My Appointments</h2>

                </div>
            </div>
        </div>
        <div style="padding-bottom: 5px;">
            <input type="checkbox" v-model="showCancelled" id="show_cancelled">
            <label for="show_cancelled" style="margin-left: 3px; font-weight: bold;">Show cancelled bookings</label>
        </div>
        <div class="hidden-on-medium-small overflow-x:auto">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>Patient</th>
                        <th>Dentist</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Message</th>
                        <th>Status</th>
                        <th>Manage</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="booking in filteredBookings" :key="booking._id">
                        <td>{{ booking.patientName }}</td>
                        <td>{{ booking.dentistName }}</td>
                        <td>{{ booking.date }}</td>
                        <td>{{ booking.time }}</td>
                        <td>{{ booking.message }}</td>
                        <td>{{ booking.status }}</td>
                        <td> <button class="btn btn-danger" @click="cancelBooking(booking)">Cancel</button> </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="hidden-on-large">
            <div class="booking-cards" v-for="booking in filteredBookings" :key="booking._id">
                <div class="booking-card">
                    <p><strong>Patient:</strong> {{ booking.patientName }}</p>
                    <p><strong>Dentist:</strong> {{ booking.dentistName }}</p>
                    <p><strong>Date:</strong> {{ booking.date }}</p>
                    <p><strong>Time:</strong> {{ booking.time }}</p>
                    <p><strong>Message:</strong> {{ booking.message }}</p>
                    <p><strong>Status:</strong> {{ booking.status }}</p>
                    <button class="btn btn-danger" @click="cancelBooking(booking)">Cancel</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
const API_GATEWAY = import.meta.env.VITE_API_GATEWAY;

export default {
    name: 'AppointmentTable',
    data() {
        return {
            bookings: [],
            userId: localStorage.getItem('userId'),
            token: localStorage.getItem('token'),
            showCancelled: false
        };
    },
    computed: {
        filteredBookings() {
            if (this.showCancelled) {
                return this.bookings;
            } else {
                return this.bookings.filter(booking => booking.status !== 'CANCELED');
            }
        }
    },
    mounted() {
        this.fetchBookings();
    },
    methods: {
        fetchBookings() {
            var temp = []
            console.log(this.userId)
            axios.get(`http://${API_GATEWAY}:80/api/v1/bookings/patient/${this.userId}`, {
                headers: {
                    Authorization: this.token
                }
            })
                .then(response => {
                    console.log("Response", response)
                    if (response.status === 200) {
                        for (const each of response.data) {
                            temp.push(each)
                        }
                        console.log(this.bookings)
                        this.bookings = temp
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Error fetching bookings');
                });
        },

        cancelBooking(booking) {
            console.log('Booking:', booking)

            axios.patch(`http://${API_GATEWAY}:80/api/v1/bookings/${booking._id}`, {
                status: 'CANCELED'
            })
                .then(() => {
                    axios.post(`http://${API_GATEWAY}:80/api/v1/bookings/`, {
                        patientName: '',
                        dentistName: booking.dentistName,
                        dentistID: booking.dentistID,
                        date: booking.date,
                        time: booking.time,
                        status: 'AVAILABLE'
                    }).then(() => {
                        alert('Booking canceled successfully');
                        this.fetchBookings();
                    })
                })

                .catch((error) => {
                    console.error(error);
                    alert('Error canceling booking');
                });

        }

    }
}

</script>

<style>
.sticky-header {
    position: sticky;
    top: 0;
    background-color: white;
    z-index: 20;
}

.text-center {
    margin-bottom: 32rem;
}

.custom-table {
    min-width: 50vw;
}


.table td,
.table th {
    padding: 1rem;
}


.table th,
.table td {
    font-size: 1.25rem;
}

/* Define card styles */
.booking-cards {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
}

.booking-card {
    width: calc(50% - 20px);
    /* Adjust the width as needed for medium screens */
    background-color: #fff;
    border: 1px solid #ccc;
    padding: 20px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Media query for small screens */
@media (max-width: 767px) {
    .booking-card {
        width: 100%;
    }
}

/* Define the media query to hide the div on medium and small screens */
@media (max-width: 991px) {
    .hidden-on-medium-small {
        display: none;
    }
}

/* Define the media query to hide the div on medium and small screens */
@media (min-width: 991px) {
    .hidden-on-large {
        display: none;
    }
}
</style>

