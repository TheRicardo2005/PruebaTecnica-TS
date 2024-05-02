import express from 'express'
import cors from 'cors'
import multer from 'multer'
import csvToJson from 'convert-csv-to-json'

const app = express()
const port = 3000

const storage = multer.memoryStorage()
const upload = multer({ storage })

let userData: Array<Record<string, string>> = []

app.use(cors()) //ENABLE CORS

app.post('/api/files', upload.single('file'), async (req, res) => {
    // 1. Extract file from request
    const { file } = req
    // 2. Validate tha we have file
    if (!file) {
        return res.status(500).json({
            message: `file is required`
        })
    }
    // 3. Validate the mimetype (csv)
    if (file.mimetype !== 'text/csv') {
        return res.status(500).json({
            message: `File must be csv`
        })
    }
    let json: Array<Record<string, string>> = []
    try {
        // 4. Transfor file (Buffer) to String
        const rawCsv = Buffer.from(file.buffer).toString('utf-8')
        console.log(`CSV ${rawCsv}`)
        json = csvToJson.fieldDelimiter(',').csvStringToJson(rawCsv)
        // 5. Transform string (csv) to JSON
    } catch (error) {
        return res.status(500).json({
            message: `Error parsing the file`
        })
    }
    // 6. Save the JSON to BD (or memory)
    userData = json
    // 7. Return 200 with the message and the JSON
    return res.status(200).json({
        data: json,
        message: `file uploaded successfully.`,
    })
})

app.get('/api/users', async (req, res) => {
    // 1. Extract the query param 'q' from the request
    const { q } = req.query
    // 2. Validate that we we have the query param
    if (!q) {
        return res.status(500).json({
            message: `Query param 'q' is required`
        })
    }

    if (Array.isArray(q)) {
        return res.status(500).json({
            message: `Query param 'q' is required`
        })
    }
    // 3. Filter the data from the BD (or memory) with the query params
    const search = q.toString().toLowerCase()

    const filterdData = userData.filter(row => {
        return Object
            .values(row)
            .some(value => value.toLowerCase().includes(search))
    })
    // 4. Return 200 with the fitered data
    return res.status(200).json({
        data: filterdData,
    })
})

app.listen(port, () => {
    console.log(`server is running at http://localhost:${port}`)
})