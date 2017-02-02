var express = require('express');
var router = express.Router();
var ctrlLog = require('./controllers/log');
var ctrlConfig = require('./controllers/config');
var ctrlAuth = require('./controllers/authentication');
var ctrlCompany = require('./controllers/company');
var ctrlCustomer = require('./controllers/customer');
var ctrlUser = require('./controllers/user');
var ctrlUpload = require('./controllers/upload');

var ctrlSilo = require('./controllers/silo');
var ctrlHeater = require('./controllers/heater');
var ctrlObject = require('./controllers/object');
var ctrlProject = require('./controllers/project');
var ctrlOrder = require('./controllers/order');
var ctrlStatistics = require('./controllers/statistics');
var ctrlCru = require('./controllers/cru');

// log section

router.get('/logs', ctrlLog.getAll);

// config section

router.get('/config', ctrlConfig.get);
router.put('/config', ctrlConfig.put);
router.post('/config', ctrlConfig.post);

// lang section

router.get('/lang', function(req, res) {
  if(!req.query.lang) return res.status(500).send();

  try {
    var lang = require('./config/locales/' + req.query.lang);
    res.status(200).json(lang);
  } catch(err) {
    res.status(404);
  }
});

// uploud section

router.post('/upload', ctrlUpload.post);

// authentication section

router.get('/register', ctrlAuth.getRegister);
router.post('/register', ctrlAuth.postRegister);

router.get('/login', ctrlAuth.getLogin);
router.post('/login', ctrlAuth.postLogin);

router.get('/logout', ctrlAuth.getLogout);
router.get('/ping', ctrlAuth.getPing);

router.get('/reset/:token', ctrlAuth.getResetToken);
router.post('/forgot', ctrlAuth.postForgot);
router.post('/reset/:token', ctrlAuth.postResetToken);

// user section

router.get('/user', ctrlUser.get);
router.get('/users', ctrlUser.getAll);
router.get('/supplierUsers', ctrlUser.getAllSuppliers);
router.get('/employeeUsers', ctrlUser.getAllEmployees);
router.get('/pmUsers', ctrlUser.getAllPms);
router.get('/pmAdminUsers', ctrlUser.getAllPmsAdmin);
router.get('/pmCustomerUsers/:id', ctrlUser.getAllPmsCustomer);
router.get('/adminUsers', ctrlUser.getAllAdmins);
router.post('/user', ctrlUser.post);
router.put('/user', ctrlUser.put);
router.delete('/user/:id', ctrlUser.delete);

// customer section

router.get('/customer', ctrlCustomer.get);
router.get('/customers', ctrlCustomer.getAll);
router.post('/customer', ctrlCustomer.post);
router.put('/customer', ctrlCustomer.put);
router.delete('/customer/:id', ctrlCustomer.delete);

// company section

router.get('/company', ctrlCompany.get);
router.get('/companies', ctrlCompany.getAll);
router.post('/company', ctrlCompany.post);
router.put('/company', ctrlCompany.put);
router.delete('/company/:id', ctrlCompany.delete);

// silo section

router.get('/silo', ctrlSilo.get);
router.get('/silos', ctrlSilo.getAll);
router.get('/silosCurrent', ctrlSilo.getAllCurrent);
router.post('/silo', ctrlSilo.post);
router.put('/silo', ctrlSilo.put);
router.delete('/silo/:id', ctrlSilo.delete);

router.post('/siloReminder', ctrlSilo.reminder);
router.post('/siloFillingLevel', ctrlSilo.changeFillingLevel);

// heater section

router.get('/heater', ctrlHeater.get);
router.get('/heaters', ctrlHeater.getAll);
router.post('/heater', ctrlHeater.post);
router.put('/heater', ctrlHeater.put);
router.delete('/heater/:id', ctrlHeater.delete);

router.get('/heater/status', ctrlHeater.getDataCollection);
router.post('/heater/status', ctrlHeater.postDataCollection);
router.delete('/heaters/status', ctrlHeater.deleteDataCollection);

router.post('/heaterChangeOperationHours', ctrlHeater.changeOperationHours);
router.post('/heaterChangeStatus', ctrlHeater.changeStatus);
router.post('/heaterSendAlert', ctrlHeater.sendAlert);
router.post('/heaterConfirmAlert', ctrlHeater.confirmAlert);
router.post('/heaterSendService', ctrlHeater.sendService);
router.post('/heaterConfirmService', ctrlHeater.confirmService);

// object section

router.get('/object', ctrlObject.get);
router.get('/objects', ctrlObject.getAll);
router.post('/object', ctrlObject.post);
router.put('/object', ctrlObject.put);
router.delete('/object/:id', ctrlObject.delete);

// project section

router.get('/project', ctrlProject.get);
router.get('/projects', ctrlProject.getAll);
router.get('/projectsCustomer/:id', ctrlProject.getAllCustomer);
router.get('/projectsSupplier/:id', ctrlProject.getAllSupplier);
router.post('/project', ctrlProject.post);
router.put('/project', ctrlProject.put);
router.delete('/project/:id', ctrlProject.delete);
router.post('/projectConfirm', ctrlProject.confirm);
router.post('/projectProlong', ctrlProject.prolong);

// order section

router.get('/order', ctrlOrder.get);
router.get('/orders', ctrlOrder.getAll);
router.get('/ordersSupplier/:id', ctrlOrder.getAllSupplier);
router.post('/order', ctrlOrder.post);
router.put('/order', ctrlOrder.put);
router.delete('/order/:id', ctrlOrder.delete);

// statistics section

router.get('/statisticsByProject', ctrlStatistics.getByProject);
router.get('/statisticsBySupplier', ctrlStatistics.getBySupplier);

// CRU section

router.get('/cru', ctrlCru.get);
router.get('/crus', ctrlCru.getAll);
router.get('/crusForDevice/:deviceId', ctrlCru.getAllForDevice);
router.post('/cru', ctrlCru.post);
router.put('/cru', ctrlCru.put);
router.delete('/cru/:id', ctrlCru.delete);

module.exports = router;