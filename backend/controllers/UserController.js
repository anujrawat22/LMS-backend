const { User } = require("../models/UserModel");
require('dotenv').config()
const bcrypt = require('bcrypt')
const saltRounds = 5
const jwt = require('jsonwebtoken');
const { sendEmail } = require("../services/nodemailer");
const otps = {};
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const { createObjectCsvWriter } = require('csv-writer');
const { Course } = require("../models/CourseModel");
const { generateVerificationToken } = require("../services/verificationToken");
const fs = require('fs');
const path = require('path');
const emailTemplatePath = path.join(__dirname, '..', 'email-templates', 'verificationEmailTemplate.html');
const LoginOTPTemplatePath = path.join(__dirname, '..', 'email-templates', 'LoginOTPTemplate.html')



exports.signup = async (req, res) => {
    const { name, email } = req.body;
    try {
        if (!name || !email) {
            return res.status(400).send({ error: "Please provide all user details" })
        }
        const findexistingUser = await User.findOne({ email })

        if (findexistingUser && findexistingUser.isVerified === false) {
            return res.status(401).send({ error: "Already registered , Please verify email to proceed" })
        }

        if (findexistingUser) {
            return res.status(401).send({ error: "User with this email Id already exists" })
        }

        const user = await User.create({
            name,
            email,
            role: 'user',
            isVerified: false
        })

        const verificationToken = generateVerificationToken(user._id)

        user.verificationToken = verificationToken
        await user.save()

        const verificationLink = `${process.env.DOMAIN_URL}/api/users/verify/${verificationToken}`;

        const emailTemplate = fs.readFileSync(emailTemplatePath, 'utf-8');

        const emailBody = emailTemplate
            .replace('{userName}', user.name)
            .replace('{verificationLink}', verificationLink);

        await sendEmail(email, 'Email Verification', emailBody)

        const createdUser = await User.findById(user._id).select("-refreshToken")
        if (!createdUser) {
            return res.status(500).send({ error: "Something went wrong while registering the user" })
        }
        res.status(201).json({
            msg: `Verification email send to ${user.email} , Please verify to continue`
        })
    } catch (error) {
        console.log("Error signing up :", error);
        res.status(500).send({ error: "Server error " })
    }
}

exports.verifyUser = async (req, res) => {
    const { token } = req.params;
    try {
        jwt.verify(token, process.env.VERIFICATION_TOKEN_KEY, async (err, decoded) => {
            if (err) {
                res.status(500).send({ error: 'Something went wrong' })
            }

            if (decoded) {
                const userId = decoded.userId
                const user = await User.findById(userId)
                user.isVerified = true;
                await user.save()
                const loginPageURL = `${process.env.DOMAIN_URL}/login`
                res.redirect(loginPageURL);
            } else {
                res.status(500).send({ error: "Something went wrong" })
            }
        })
    } catch (error) {
        console.log("Error is verifying user :", error)
        res.status(500).send({ error: "Internal server error" })
    }
}

exports.SendVerificationEmail = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email })

        if (!user) {
            return res.status(404).send({ error: 'User does not exist, Please Signup' })
        }

        const verificationToken = generateVerificationToken(user._id)
        user.verificationToken = verificationToken;
        await user.save()

        const verificationLink = `${process.env.DOMAIN_URL}/api/users/verify/${verificationToken}`;

        const emailTemplate = fs.readFileSync(emailTemplatePath, 'utf-8');

        const emailBody = emailTemplate
            .replace('{userName}', user.name)
            .replace('{verificationLink}', verificationLink);
        await sendEmail(email, 'Email Verification', emailBody)

        res.status(200).send({ msg: 'Verification email sent to user email Id' })
    } catch (error) {
        console.log("Error sending user verification email:", error)
        res.status(500).send({ error: 'Internal Server error' })
    }
}

const generateAccessAndRefereshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)

        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })
        return { accessToken, refreshToken }
    } catch (error) {
        throw new Error(500, "Something went wrong while generating referesh and access token:", error)
    }
}


exports.login = async (req, res) => {
    const { email, otp } = req.body;
    try {
        if (!email || !otp) {
            return res.status(401).send({ error: "Please fill required fields" })
        }

        const user = await User.findOne({ email })

        if (!user) {
            return res.status(404).send({ error: "User doesn't exist , Please signup" })
        }

        if (user.otp.code !== otp) {
            return res.status(401).send({ error: "Invalid OTP" });
        }

        if (user.otp.expiry < new Date()) {
            return res.status(401).send({ error: "OTP Expired" })
        }

        user.otp = {};
        await user.save();
        const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id)

        const loggedInUser = await User.findById(user._id).select("-refreshToken")


        const options = {
            expiresIn: new Date(
                Date.now() + 1000 * 60 * 60 * 24 * process.env.JWT_COOKIE_EXPIRE
            ),
            httpOnly: true,
            sameSite: "none",
            secure: true
        };


        res.cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options)

        return res.status(200).json({
            msg: "Login Successfull",
            loggedInUser
        })
    } catch (error) {
        console.log("Error in logging In :", error)
        res.status(500).send({ error: "Server error" })
    }
}

exports.GenerateLoginOTP = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const otpCode = generateOTP()

        user.otp = {
            code: otpCode,
            expiry: new Date(Date.now() + 5 * 60 * 1000), // OTP is valid for 5 minutes
        };

        await user.save();

        const emailTemplate = fs.readFileSync(LoginOTPTemplatePath, 'utf-8')

        const emailBody = emailTemplate
            .replace('{userName}', user.name)
            .replace('{otpCode}', otpCode);

        await sendEmail(email, 'Login OTP', emailBody)

        res.status(200).send({ msg: `OTP send to ${email}` })
    } catch (error) {
        console.log("Error in sending otp :", error)
        res.status(500).send({ error: 'Internal Server Error' })
    }
}


exports.logout = async (req, res) => {
    const id = req.userId;
    try {
        await User.findByIdAndUpdate(
            id,
            {
                $set: {
                    refreshToken: undefined
                }
            },
            {
                new: true
            }
        )
        return res
            .status(200)
            .clearCookie('accessToken')
            .clearCookie('refreshToken')
            .send({ msg: "User logged Out" })
    } catch (error) {
        console.log("Error logging out user:", error)
        res.status(500).send({ error: 'Server error' })
    }
}

exports.refreshAccessToken = async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken;
    if (!incomingRefreshToken) {
        return res.status(401).send({ error: "Unauthorized request" })
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)


        const user = await User.findById(decodedToken?._id)


        if (!user) {
            return res.status(401).send({ error: "Invalid refresh token" })
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            return res.status(401).send({ error: "Refresh token is expired or used" })
        }

        const options = {
            expires: new Date(
                Date.now() + 1000 * 60 * 60 * 24 * process.env.JWT_COOKIE_EXPIRE
            ),
            httpOnly: true,
            secure: false,
            sameSite: "none",
        };

        const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id)


        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .send({
                msg: "Access token refreshed",
                loggedInUser: user
            })
    } catch (error) {
        console.log("Refresh Token error :", error)
        res.status(401).send({ error: error?.message || "Invalid refresh token" })
    }
}


const calculateDateDifference = (startDate, endDate) => {
    const dateDiff = endDate - startDate;
    const daysDiff = Math.floor(dateDiff / (24 * 60 * 60 * 1000));
    const monthsDiff = Math.floor(daysDiff / 30);
    const yearsDiff = Math.floor(monthsDiff / 12);

    if (yearsDiff > 0) {
        return `${yearsDiff} ${yearsDiff === 1 ? 'year' : 'years'}`;
    } else if (monthsDiff > 0) {
        return `${monthsDiff} ${monthsDiff === 1 ? 'month' : 'months'}`;
    } else {
        return `${daysDiff} ${daysDiff === 1 ? 'day' : 'days'}`;
    }
};

exports.userDetails = async (req, res) => {
    let { page, limit, name, email } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const filterOptions = {};

    if (name) {
        filterOptions.name = { $regex: name, $options: 'i' };
    }
    if (email) {
        filterOptions.email = { $regex: email, $options: 'i' };
    }

    filterOptions.role = { $in: ['admin', 'user'] };

    try {
        const totalDocuments = await User.countDocuments(filterOptions);
        const users = await User.find(filterOptions)
            .select('name email lastLogin joined role')
            .skip((page - 1) * limit)
            .limit(limit)
            .exec();

        const today = new Date();

        const formattedUsers = users.map(user => {
            const lastLoginPeriod = user.lastLogin ? calculateDateDifference(new Date(user.lastLogin), today) : null;
            const joinedPeriod = calculateDateDifference(new Date(user.joined), today);

            return {
                ...user.toObject(),
                lastLogin: lastLoginPeriod,
                joined: joinedPeriod,
            };
        });

        res.status(200).send({
            msg: 'User data',
            data: formattedUsers,
            currentPage: page,
            totalPage: Math.ceil(totalDocuments / limit),
            totalDocuments: totalDocuments,
        });
    } catch (error) {
        console.log('Error getting users data:', error);
        res.status(500).send({ error: 'Server error' });
    }
};


exports.downloadCSV = async (req, res) => {
    let { page, limit, name, email } = req.query;
    page = page ? parseInt(page) : 1;
    limit = limit ? parseInt(limit) : 10;

    const filterOptions = {
        role: 'user',

    }
    if (name) {
        filterOptions.name = { $regex: name, $options: 'i' }; // Case-insensitive search for name
    }
    if (email) {
        filterOptions.email = { $regex: email, $options: 'i' }; // Case-insensitive search for email
    }
    try {
        const totalDocuments = await User.countDocuments(filterOptions);

        const query = User.find(filterOptions).select('name email lastLogin , joined')
        query.skip((page - 1) * limit).limit(limit);

        const users = await query.exec()
        const today = new Date(); // Get the current date
        // Format the dates and calculate the time period for each user
        const formattedUsers = users.map((user) => {
            const lastLoginDate = user.lastLogin ? new Date(user.lastLogin) : null;
            const joinedDate = new Date(user.joined);

            let lastLoginPeriod = null;
            let joinedPeriod = null;

            if (lastLoginDate) {
                // Calculate the difference between lastLoginDate and today
                const yearsDiff = today.getUTCFullYear() - lastLoginDate.getUTCFullYear();
                const monthsDiff = today.getUTCMonth() - lastLoginDate.getUTCMonth();
                const daysDiff = today.getUTCDate() - lastLoginDate.getUTCDate();

                if (daysDiff < 0) {
                    monthsDiff--; // Decrement months if the days are negative
                    daysDiff += new Date(today.getUTCFullYear(), today.getUTCMonth(), 0).getUTCDate(); // Add days to make it positive
                }
                if (monthsDiff < 0) {
                    yearsDiff--; // Decrement years if the months are negative
                    monthsDiff += 12; // Add 12 months to make it positive
                }

                if (yearsDiff === 0 && monthsDiff === 0) {
                    if (daysDiff <= 1) {
                        lastLoginPeriod = `${daysDiff} day ago`;
                    } else {

                        lastLoginPeriod = `${daysDiff} days ago`;
                    }
                } else {
                    lastLoginPeriod = `${yearsDiff} years, ${monthsDiff} months, and ${daysDiff} days ago`;
                }
            }

            if (joinedDate) {
                // Calculate the difference between joinedDate and today
                const yearsDiff = today.getUTCFullYear() - joinedDate.getUTCFullYear();
                const monthsDiff = today.getUTCMonth() - joinedDate.getUTCMonth();
                const daysDiff = today.getUTCDate() - joinedDate.getUTCDate();

                if (daysDiff < 0) {
                    monthsDiff--; // Decrement months if the days are negative
                    daysDiff += new Date(today.getUTCFullYear(), today.getUTCMonth(), 0).getUTCDate(); // Add days to make it positive
                }
                if (monthsDiff < 0) {
                    yearsDiff--; // Decrement years if the months are negative
                    monthsDiff += 12; // Add 12 months to make it positive
                }

                if (yearsDiff === 0 && monthsDiff === 0) {
                    if (daysDiff <= 1) {
                        joinedPeriod = `${daysDiff} day ago`;
                    } else {

                        joinedPeriod = `${daysDiff} days ago`;
                    }
                } else {
                    joinedPeriod = `${yearsDiff} years, ${monthsDiff} months, and ${daysDiff} days ago`;
                }
            }

            return {
                ...user.toObject(),
                lastLogin: lastLoginPeriod,
                joined: joinedPeriod,
            };
        });
        const csvWriter = createObjectCsvWriter({
            path: 'user_data.csv', // Define the file name
            header: [
                { id: '_id', title: 'ID' },
                { id: 'name', title: 'Name' },
                { id: 'email', title: 'Email' },
                { id: 'lastLogin', title: 'Last Login' },
                { id: 'joined', title: 'Joined' },
            ],
        });

        // Write the CSV file
        await csvWriter.writeRecords(formattedUsers);

        // Serve the file for download
        res.download('user_data.csv', (err) => {
            if (err) {
                console.error('Error downloading CSV:', err);
                res.status(500).send({ error: 'Server error' });
            }
        });
    } catch (error) {
        console.log("Error getting users data :", error)
        res.status(500).send({ error: "Server error" })
    }
}


exports.userdetailsbyId = async (req, res) => {
    const { id } = req.params;
    try {
        const users = await User.find({ _id: id }).select("name email lastLogin joined role courses avatar").populate({
            path: 'courses',
            select: 'title'
        }).exec()
        let today = new Date(); // Get the current date

        // Format the dates and calculate the time period for each user
        const formattedUsers = users.map((user) => {
            let lastLoginDate = user.lastLogin ? new Date(user.lastLogin) : null;
            let joinedDate = new Date(user.joined);

            let lastLoginPeriod = null;
            let joinedPeriod = null;

            if (lastLoginDate) {
                // Calculate the difference between lastLoginDate and today
                let yearsDiff = today.getUTCFullYear() - lastLoginDate.getUTCFullYear();
                let monthsDiff = today.getUTCMonth() - lastLoginDate.getUTCMonth();
                let daysDiff = today.getUTCDate() - lastLoginDate.getUTCDate();

                if (daysDiff < 0) {
                    monthsDiff--; // Decrement months if the days are negative
                    daysDiff += new Date(today.getUTCFullYear(), today.getUTCMonth(), 0).getUTCDate(); // Add days to make it positive
                }
                if (monthsDiff < 0) {
                    yearsDiff--; // Decrement years if the months are negative
                    monthsDiff += 12; // Add 12 months to make it positive
                }

                if (yearsDiff === 0 && monthsDiff === 0) {
                    lastLoginPeriod = `${daysDiff} days ago`;
                } else {
                    lastLoginPeriod = `${yearsDiff} years, ${monthsDiff} months, and ${daysDiff} days ago`;
                }
            }

            if (joinedDate) {
                // Calculate the difference between joinedDate and today
                let yearsDiff = today.getUTCFullYear() - joinedDate.getUTCFullYear();
                let monthsDiff = today.getUTCMonth() - joinedDate.getUTCMonth();
                let daysDiff = today.getUTCDate() - joinedDate.getUTCDate();

                if (daysDiff < 0) {
                    monthsDiff--; // Decrement months if the days are negative
                    daysDiff += new Date(today.getUTCFullYear(), today.getUTCMonth(), 0).getUTCDate(); // Add days to make it positive
                }
                if (monthsDiff < 0) {
                    yearsDiff--; // Decrement years if the months are negative
                    monthsDiff += 12; // Add 12 months to make it positive
                }

                if (yearsDiff === 0 && monthsDiff === 0) {
                    joinedPeriod = `${daysDiff} days ago`;
                } else {
                    joinedPeriod = `${yearsDiff} years, ${monthsDiff} months, and ${daysDiff} days ago`;
                }
            }

            return {
                ...user.toObject(),
                lastLogin: lastLoginPeriod,
                joined: joinedPeriod,
            };
        });
        res.status(200).send({ msg: `User details of id - ${id}`, data: formattedUsers })
    } catch (error) {
        console.log("Error getting user details :", error)
        res.status(500).send({ error: "Server error" })
    }
}


exports.sendEmail = async (req, res) => {
    const { studentIds, subject, body } = req.body;
    try {
        const users = Object.keys(studentIds)
        if (users.length === 0 || (subject === '' || null) || (body === '' || null)) {
            return res.status(400).send({ error: "Enter required fields" })
        }
        const selectedUserIds = users.filter(userId => studentIds[userId]);

        const emails = await User.find({ _id: { $in: selectedUserIds } },
            'email')

        for (const user of emails) {
            await sendEmail(user.email, subject, body)
        }
        res.status(200).send({ msg: "Email sent succesfully" })
    } catch (error) {
        console.log("Error sending emails :", error)
        res.status(500).send({ error: "Server error" })
    }
}

exports.updaterole = async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;
    try {
        console.log(id, role)
        const user = await User.findById(id)
        if (!user) {
            return res.status(404).send({ error: "User not found" })
        }
        user.role = role;
        await user.save()
        console.log(user)
        res.status(201).send({ msg: "Role updated succesfully" })
    } catch (error) {
        console.log("Error updating the user role :", error)
        res.status(500).send({ error: "Server error" })
    }
}

exports.checkAuth = async (req, res) => {
    const userId = req.userId;
    try {
        const user = await User.findById(userId).select("-password -refreshToken")
        if (!user) {
            return res.status(404).send({ error: "User not found" })
        }
        return res.status(200).send({ msg: "User is authenticated", loggedInUser: user })
    }
    catch (error) {
        console.log("Error in auto login :", error)
        res.status(500).send({ error: "Server error " })
    }
}


exports.deleteUser = async (req, res) => {
    const { Id } = req.params;
    const userId = req.userId;
    try {
        if (Id === userId) {
            return res.status(401).send({ error: "Admin can't delete himself" })
        }
        const user = await User.findById(Id)
        if (!user) {
            return res.status(404).send({ error: "User does not exist" })
        }
        await User.findByIdAndDelete(Id)
        res.status(200).send({ msg: "User deleted successfully" })
    } catch (error) {
        console.log("Error deleting the user :", error)
        res.status(500).send({ error: "Server error" })
    }
}

exports.addStudent = async (req, res) => {
    const { students, courses } = req.body
    try {
        if (!Array.isArray(students) || students.length === 0) {
            return res.status(400).send({ error: "Students data must be a non-empty array" });
        }

        const results = await Promise.all(
            students.map(async (student) => {
                const { email, password, name } = student;

                // Check if the required fields are present
                if (!email || !password || !name || !courses || !Array.isArray(courses)) {
                    return { error: "Each student must have email, password, name, and courses array" };
                }

                // Check if the user with the same email already exists
                const findExistingUser = await User.findOne({ email });
                if (findExistingUser) {
                    return { error: `User with email ${email} already exists` };
                }

                // Hash the password
                const saltRounds = 10;
                const hashedPassword = await bcrypt.hash(password, saltRounds);

                // Create a user object
                const newUser = new User({
                    name,
                    email,
                    password: hashedPassword,
                    joined: new Date(),
                    courses,
                });

                // Save the user to the database
                await newUser.save();

                return { success: `User with email ${email} added successfully` };
            })
        );

        // Process results and send response
        const successResults = results.filter((result) => result.success);
        const errorResults = results.filter((result) => result.error);

        res.status(201).send({
            msg: "Students Added",
            success: successResults,
            errors: errorResults,
        });
    } catch (error) {
        console.log("Error adding the student :", error)
        res.status(500).send({ error: "Server error" })
    }
}

exports.checkUserCourse = async (req, res) => {
    const userId = req.userId;
    const { courseId } = req.params;
    try {
        const user = await User.findById(userId)
        // Validate if courseId is a valid ObjectId
        if (!ObjectId.isValid(courseId)) {
            return res.status(400).send({ error: 'Invalid courseId format' });
        }

        const targetCourseId = new ObjectId(courseId);

        // Check if the targetCourseId is in the user.courses array
        const hasCourse = user.courses.some(course => course.equals(targetCourseId));

        res.status(200).send({ hasCourse });
    } catch (error) {
        console.log("Error checking user courses :", error)
        res.status(500).send({ error: "Server error" })
    }
}

exports.UserCourses = async (req, res) => {
    const userId = req.userId;
    try {
        const user = await User.findById(userId).populate('courses')

        if (!user) {
            return res.status(404).send({ error: "User not found" })
        }

        const courses = await Course.populate(user.courses, { path: 'createBy' });

        return res.status(200).json({ courses })

    } catch (error) {
        console.log("Error in fetching user courses :", error)
        res.status(500).send({ error: "Server error" })
    }
}

exports.ImportCSV = async (req, res) => {
    const file = req.file;
    if (!file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    const filedata = file.buffer.toString('utf-8')
    try {
        const results = [];

        const rows = filedata.split('\n').map(row => row.trim());
        const headers = rows[0].split(',')

        for (let i = 1; i < rows.length; i++) {
            const rowData = rows[i].split(',');
            const user = {};

            if (rowData.length < headers.length) {
                console.log(`Error: Data missing in row ${i}`);
                continue; // Skip this row if data is missing
            }

            headers.forEach((header, index) => {
                if (header === 'courses') {
                    // For the 'courses' header, combine the remaining elements in rowData
                    user[header] = rowData.slice(index).join(', ').replace(/"/g, '').trim();
                } else {
                    user[header] = rowData[index];
                }
            })
            const { name, email, password, courses } = user;

            const existingUser = await User.findOne({ email });

            if (existingUser) {
                console.log(`User with email ${email} already exists , skipping row ${i}`)
                continue;
            }

            const courseNames = splitCourses(courses);
            if (courseNames.length === 0) {
                console.log(`No courses assigned to user ${name}`)
                continue;
            }
            const courseIds = await getCourseIds(courseNames);
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            const newUser = new User({
                name,
                email,
                password: hashedPassword,
                courses: courseIds,
            });

            await newUser.save();

            results.push(newUser);
        }

        res.status(201).send({ msg: "Students added", data: results });
    } catch (error) {
        console.log("Error adding students :", error)
        res.status(500).send({ error: "Server error" })
    }
}

function splitCourses(courses) {
    const courseNames = [];
    const courseArray = courses.split(',');
    console.log(courses)
    for (const course of courseArray) {
        courseNames.push(course.trim().replace(/"/g, ''));
    }

    return courseNames;
}
async function getCourseIds(courseNames) {
    const courseIds = [];
    for (const courseName of courseNames) {
        if (!courseName) continue; // Skip empty course names
        const course = await Course.findOne({ title: courseName }).select('_id');
        if (course) {
            courseIds.push(course._id);
        } else {
            console.log(`Course not found for: ${courseName}`);
        }
    }
    return courseIds;
}


function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}