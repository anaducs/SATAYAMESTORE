const errorHandler = (err, req, res, next) => {

    if (err.name === 'UnauthorizedError')
    {
        return res.status(404).json({ message: 'user not authorized' });
    }
    
    else if (err.name === 'ValdiationError') {
        return res.status(404).json({ message: 'validation error' });
    }
    else {
        return res.status(500).json({ message: err.message });
    }
   
}

module.exports = errorHandler;