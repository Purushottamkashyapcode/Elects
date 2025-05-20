const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config(); // Correct usage for dotenv
require('./schedulars/photoUpdateScheduler'); // Custom scheduler

// Middleware
app.use(cors());
app.use(express.json());
app.use('/public/uploads', express.static(path.join(__dirname, '/public/uploads')));

// Environment variables check
const { API_URL, CONNECTION_STRING, PORT } = process.env;

if (!API_URL || !CONNECTION_STRING || !PORT) {
    console.error("❌ ERROR: Missing environment variables. Please ensure API_URL, CONNECTION_STRING, and PORT are set.");
    process.exit(1);
}

// Routers
const usersRoutes = require('./routers/users');
const candidateRoutes = require('./routers/candidates');
const projectRoutes = require('./routers/projects');
const commentRoutes = require('./routers/comments');
const electionRoutes = require('./routers/Elections');
const complaintsRoutes = require('./routers/complaints');
const partiesRoutes = require('./routers/parties');
const resultsRoutes = require('./routers/results');
const peoplesRoutes = require('./routers/peoples');
const adminsRoutes = require('./routers/admins');
const presidentialElectionsRoutes = require('./routers/presidentialElections');
const parlimentaryElectionsRoutes = require('./routers/parlimentaryElections');
const provinvialElectionsRoutes = require('./routers/provincialElections');
const passwordRecoveryRoutes = require('./routers/passwordrecoveryroute');
const verificationsRoutes = require('./routers/verifications');
const candidateDescriptionRoutes = require('./routers/candidateDescriptionRoutes');
const reportFakesRoutes = require('./routers/reportFakes');
const uploadRoute = require('./routers/uploadRoute');

// Register API routes
app.use(`${API_URL}/users`, usersRoutes);
app.use(`${API_URL}/candidates`, candidateRoutes);
app.use(`${API_URL}/projects`, projectRoutes);
app.use(`${API_URL}/comments`, commentRoutes);
app.use(`${API_URL}/elections`, electionRoutes);
app.use(`${API_URL}/complaints`, complaintsRoutes);
app.use(`${API_URL}/parties`, partiesRoutes);
app.use(`${API_URL}/results`, resultsRoutes);
app.use(`${API_URL}/peoples`, peoplesRoutes);
app.use(`${API_URL}/admins`, adminsRoutes);
app.use(`${API_URL}/presidentialElections`, presidentialElectionsRoutes);
app.use(`${API_URL}/parlimentaryElections`, parlimentaryElectionsRoutes);
app.use(`${API_URL}/provincialElections`, provinvialElectionsRoutes);
app.use(`${API_URL}/passwords`, passwordRecoveryRoutes); // Only once
app.use(`${API_URL}/verifications`, verificationsRoutes);
app.use(`${API_URL}/description`, candidateDescriptionRoutes);
app.use(`${API_URL}/reportFakes`, reportFakesRoutes);
app.use(`${API_URL}/upload`, uploadRoute);

// Connect to MongoDB
mongoose
    .connect(CONNECTION_STRING, { dbName: 'ElectSDatabase', useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('✅ Database Connection is ready...'))
    .catch((err) => {
        console.error("❌ Database connection error:", err);
        process.exit(1);
    });

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
