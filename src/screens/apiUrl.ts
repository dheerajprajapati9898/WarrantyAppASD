

const baseUrl = "https://warrantyuat.tyrechecks.com";

const RemoteUrls = {
    baseUrl,
    getStateUrl: `${baseUrl}/api/State/StateMaster`,
    getOldTyreCompanyUrl: `${baseUrl}/api/OldTyreCompany/OldTyreCompany`,
    getProductUrl: `${baseUrl}/api/Product/ProductWithBrand`,
    getTyreBrandUrl: `${baseUrl}/api/TyreBrand/TyreBrandMaster`,
    getOldTyreBrandUrl: `${baseUrl}/api/TyreBrand/OldTyreBrand`,
    getTyreSizeUrl: `${baseUrl}/api/TyreSize/TyreSizeMaster`,
    getVehicleMakeUrl: `${baseUrl}/api/VehicleMake/VehicleMakeMaster`,
    getVehicleModelUrl: `${baseUrl}/api/VehicleModel/VehicleModelMaster`,
    getVehicleTypeUrl: `${baseUrl}/api/VehicleType/VehicleTypeMaster`,
    getVehicleVariantUrl: `${baseUrl}/api/VehicleVariant/VehicleVariantMaster`,
    getWarrantyCountUrl: `${baseUrl}/api/Warranty/WarrantyCount`,
    postSearchWarrantyUrl: `${baseUrl}/api/Warranty/SearchWarranty`,
    postWarrantyRegistrationUrl: `${baseUrl}/api/Warranty/WarrantyRegistration`,
    postPincodeUrl: `${baseUrl}/api/District/DistrictMasterFromStateID`,
    postChangePasswordUrl: `${baseUrl}/api/ChangePassword/Changepassword`,
    postUploadUrl: `${baseUrl}/api/Upload/UploadImage`,
    postloginUrl: ` ${baseUrl}/api/Login/Login`,
    postAgencyFeatureUrl: ` ${baseUrl}/api/AgencyFeature/AgencyFeatures`,
    postWarrantyImageMissingListUrl: ` ${baseUrl}/api/Warranty/WarrantyImageMissingList`,
    postMultiLanguageUrl: `${baseUrl}/api/MultiLanguage/Language`,
    postLoginWithOTPUrl: `${baseUrl}/api/Service/LoginWithOTP`,
    postLoginOTPVerificationUrl: `${baseUrl}/api/Service/LoginOTPVerification`,

};

export default RemoteUrls;