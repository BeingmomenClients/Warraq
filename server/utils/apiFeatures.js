class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };

    const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
    excludedFields.forEach(el => delete queryObj[el]);

    // 1B) Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  search() {
    if (this.queryString.search) {
      const { search } = this.queryString;
  
      // Specify the fields to search on
      const textFields = [
        'name', 
        'phone', 
        'email', 
        'title', 
        'author', 
        'slug', 
        'address'
      ];
      const numberFields = ['serialNumber'];
      const dateFields = ['createdAt'];
  
      // Check if the search term can be converted to a number
      const searchNumber = isNaN(Number(search)) ? null : Number(search);
      
      // Enhanced date parsing to handle partial year/date strings
      const parsePartialDate = (searchTerm) => {
        // Check for partial year match
        if (/^\d{4}$/.test(searchTerm)) {
          const year = parseInt(searchTerm);
          return {
            $gte: new Date(year, 0, 1),
            $lt: new Date(year + 1, 0, 1)
          };
        }
        
        // Try to parse full date
        const parsedDate = new Date(searchTerm);
        return !isNaN(parsedDate) ? parsedDate : null;
      };
  
      // Create search conditions
      const searchConditions = [
        // Text fields with case-insensitive regex search
        ...textFields.map(field => ({ [field]: new RegExp(search, 'i') }))
      ];
  
      // Add exact number field search if possible
      if (searchNumber !== null) {
        searchConditions.push(...numberFields.map(field => ({ [field]: searchNumber })));
      }
  
      // Add date field search if possible
      const searchDate = parsePartialDate(search);
      if (searchDate) {
        searchConditions.push(...dateFields.map(field => ({ 
          [field]: searchDate.$gte ? 
            { $gte: searchDate.$gte, $lt: searchDate.$lt } : 
            { 
              $gte: new Date(searchDate.getFullYear(), searchDate.getMonth(), searchDate.getDate()),
              $lt: new Date(searchDate.getFullYear(), searchDate.getMonth(), searchDate.getDate() + 1)
            }
        })));
      }
  
      // Add exact serialNumber text match
      if (search) {
        searchConditions.push({ serialNumber: search });
      }
  
      this.query = this.query.find({ $or: searchConditions });
    } else {
      this.query = this.query;
    }
  
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}
module.exports = APIFeatures;
