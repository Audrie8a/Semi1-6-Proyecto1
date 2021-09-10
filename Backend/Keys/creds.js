let aws_keys = {
    s3: {
        region: 'us-east-2',
        accessKeyId: "AKIAS5BMI5IOEUTT6JEK",
        secretAccessKey: "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",
        //apiVersion: '2006-03-01',
    },
    dynamodb: {
        apiVersion: '2012-08-10',
        region: 'us-east-2',
        accessKeyId: "",
        secretAccessKey: ""
    },
    rekognition: {
        region: '',
        accessKeyId: "",
        secretAccessKey: "" 
    },
    translate: {
        region: '',
        accessKeyId: "",
        secretAccessKey: "" 
    },
    cognito:{
        UserPoolId: '',
        ClientId: ''
    }
}
module.exports = aws_keys
