const { User } = require("../models/UserModel");
require('dotenv').config()
const bcrypt = require('bcrypt')
const saltRounds = 5
const jwt = require('jsonwebtoken');
const { sendEmail } = require("../services/nodemailer");
const secretKey = process.env.SECRET_KEY;
const otps = {};
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const fs = require('fs');
const { createObjectCsvWriter } = require('csv-writer');
const { Course } = require("../models/CourseModel");

exports.signup = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        if (!name || !email || !password) {
            return res.status(400).send({ error: "Please provide all user details" })
        }
        const findexistingUser = await User.findOne({ email })

        if (findexistingUser) {
            return res.status(401).send({ error: "User with this email Id already exists" })
        }
        bcrypt.hash(password, saltRounds, async (err, hash) => {
            if (err) {
                return res.status(500).send({ error: "Something went wrong" })
            }
            const user = new User({ name, email, password: hash, role, joined: new Date })
            await user.save()
            res.status(201).send({ msg: "Signup Successful" })
        })
    } catch (error) {
        console.log("Error signing up :", error);
        res.status(500).send({ error: "Server error " })
    }
}


exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(401).send({ error: "Please provide the required fields" })
        }

        const user = await User.findOne({ email })

        if (!user) {
            return res.status(404).send({ error: "User doesn't exist , Please signup" })
        }
        const hashedPassword = user.password
        bcrypt.compare(password, hashedPassword, async (err, result) => {
            if (err) {
                return res.status(500).send({ error: "Something went wrong" })
            }
            if (result) {
                const options = {
                    expiresIn: 1000 * 60 * 15
                }
                const token = jwt.sign({ id: user._id, role: user.role }, secretKey, { expiresIn: "7d" })
                res.cookie('token', token, options)
                user.lastLogin = new Date;
                await user.save();
                return res.status(200).send({ msg: "Login successful", username: user.name, token, role: user.role, avatar: user.avatar })
            } else {
                return res.status(400).send({
                    error: "Invalid credentials"
                })
            }
        })
    } catch (error) {
        console.log("Error in logging In :", error)
        res.status(500).send({ error: "Server error" })

    }
}


exports.forgetPassword = async (req, res) => {
    const { email } = req.body;
    const otp = generateOTP()
    otps[email] = otp;

    const subject = 'Password Reset OTP';
    const text = `Your OTP for password reset is : ${otp}`
    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).send({ error: "User dosen't exist" })
        }
        await sendEmail(email, subject, text)

        setTimeout(() => {
            delete otps[email];
            console.log(`Deleted OTP for email: ${email}`);
        }, 600000);

        res.status(200).send({ msg: `Otp sent to ${email}` })
    } catch (error) {
        console.log("Error sending OTP to email:", error)
        res.status(500).send({ error: "Server error" })
    }
}


exports.verifyOTP = async (req, res) => {
    const { enteredOTP, email } = req.body;
    try {
        if (otps[email] !== enteredOTP) {
            return res.status(400).send({ error: "Invalid OTP" })
        }
        delete otps[email]
        res.status(200).send({ msg: "OTP Validation successful" })
    } catch (error) {
        console.log("Error in OTP validation :", error)
        res.status(500).send({ error: "Server error" })
    }
}


exports.resetPassword = async (req, res) => {
    const { email, newPassword } = req.body;
    console.log(email, newPassword)
    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).send({ error: "User doesn't exists " })
        }
        bcrypt.hash(newPassword, 5, async (err, hash) => {
            if (err) {
                return res.status(400).send({ error: "Something went wrong" })
            }
            if (hash) {
                user.password = hash;
                await user.save();
                res.status(200).send({ msg: "Password Changed" })
            }
        })
    } catch (error) {
        console.log("Error changing password :", error)
        res.status(500).send({ error: "Server error" })
    }
}

exports.userDetails = async (req, res) => {
    let { page, limit, name, email } = req.query;
    page = page ? parseInt(page) : 1;
    limit = limit ? parseInt(limit) : 10;

    const filterOptions = {}
    if (name) {
        filterOptions.name = { $regex: name, $options: 'i' }; // Case-insensitive search for name
    }
    if (email) {
        filterOptions.email = { $regex: email, $options: 'i' }; // Case-insensitive search for email
    }

    filterOptions.role = { $in: ['admin', 'user'] };
    try {
        const totalDocuments = await User.countDocuments(filterOptions);

        const query = User.find(filterOptions).select('name email lastLogin  joined role')
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
        res.status(200).send({ msg: "User data", data: formattedUsers, currentPage: page, totalPage: Math.ceil(totalDocuments / limit), totalDocuments: totalDocuments })
    } catch (error) {
        console.log("Error getting users data :", error)
        res.status(500).send({ error: "Server error" })
    }
}

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
        console.log(emails)

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

exports.autoLogin = async (req, res) => {
    const userId = req.userId;
    try {
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).send({ error: "User doesn't exist" })
        }
        const options = {
            expiresIn: 1000 * 60 * 15
        }
        const token = jwt.sign({ id: user._id, role: user.role }, secretKey, { expiresIn: "7d" })
        res.cookie('token', token, options)
        return res.status(200).send({ msg: "Login successful", username: user.name, token, role: user.role, avatar: user.avatar })
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
    console.log(courseId)
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