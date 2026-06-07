const Model = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');
const ImageMiddleware = require('../utils/imageMiddleware');
const imageMiddleware = new ImageMiddleware('users');

// const imageUploadFields = [
//   { name: 'coverImage', maxCount: 1 },
//   { name: 'images', maxCount: 3 }
// ];

exports.uploadImages = imageMiddleware.uploadImages();
exports.resizeImages = imageMiddleware.resizeImages();

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400
      )
    );
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(
    req.body,
    'name',
    'email',
    'country',
    'phone',
    'photo',
    'slug'
  );
  if (req.file) filteredBody.photo = req.file.filename;

  // 3) Update user document
  const updatedUser = await Model.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    message: 'Updated successfully',
    data: {
      user: updatedUser
    }
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await Model.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.createOne = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined! Please use /signup instead'
  });
};

exports.createRepresentative = catchAsync(async (req, res, next) => {
  const body = req.body;
  const newRepresentative = await Model.create({
    name: body.name,
    email: body.email,
    phone: body.phone,
    password: body.password,
    passwordConfirm: body.passwordConfirm,
    role: 'representative'
  });

  res.status(201).json({
    status: 'success',
    message: 'Created successfully',
    data: {
      data: newRepresentative
    }
  });
});

exports.createAdmin = catchAsync(async (req, res, next) => {
  const body = req.body;
  const newAdmin = await Model.create({
    name: body.name,
    email: body.email,
    phone: body.phone,
    password: body.password,
    passwordConfirm: body.passwordConfirm,
    role: 'admin'
  });

  res.status(201).json({
    status: 'success',
    message: 'Created successfully',
    data: {
      data: newAdmin
    }
  });
});

exports.getOne = factory.getOne(Model, [
  { path: 'bookstores', select: 'name -representativeIds' }
]);

exports.getAll = catchAsync(async (req, res, next) => {
  await factory.getAll(
    Model,
    [{ path: 'bookstores', select: 'name -representativeIds' }],
    true,
    false
  )(req, res, async () => {
    const data = req.resultDocs;

    const filterData = data.data.filter(x => x.role !== 'dev');

    res.status(200).json({
      status: 'success',
      data: {
        data: filterData,
        status: 'success',
        total: data.total,
        results: filterData.length
      }
    });
  });
});

exports.getAllNoPagination = factory.getAllNoPagination(Model, []);
exports.getAllNoPagination = factory.getAllRepresentativeNoPagination(
  Model,
  []
);

// Do NOT update passwords with this!
exports.updateOne = factory.updateOne(Model);

// exports.deleteOne = (req, res, next) => {
//   deleteImageMiddleware(Model, ['photo'])(req, res, () => {
//     factory.deleteOne(Model)(req, res, () => {
//       res.status(204).json({
//         status: 'success',
//         message: 'Deleted successfully',
//         data: null
//       });
//     });
//   });
// };
exports.deleteOne = factory.deleteOne(Model, ['photo']);
