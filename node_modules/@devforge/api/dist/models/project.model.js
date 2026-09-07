"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Project = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const ProjectSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        default: '',
        trim: true,
    },
    ownerId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    status: {
        type: String,
        enum: ['active', 'archived', 'indexing', 'error'],
        default: 'active',
    },
    framework: {
        type: String,
        enum: ['react', 'express', 'nextjs', 'node', 'python', 'unknown'],
        default: 'unknown',
    },
    repositoryUrl: {
        type: String,
        default: '',
    },
    githubRepoId: {
        type: String,
        default: '',
    },
    githubFullName: {
        type: String,
        default: '',
    },
    isPrivateRepo: {
        type: Boolean,
        default: false,
    },
    branch: {
        type: String,
        default: 'main',
    },
    isIndexed: {
        type: Boolean,
        default: false,
    },
    indexedAt: {
        type: Date,
    },
    fileCount: {
        type: Number,
        default: 0,
    },
    testHealthScore: {
        type: Number,
        default: 100,
    },
    securityScore: {
        type: Number,
        default: 100,
    },
    codeQualityScore: {
        type: Number,
        default: 100,
    },
}, {
    timestamps: true,
});
ProjectSchema.index({ ownerId: 1, createdAt: -1 });
ProjectSchema.methods.toDTO = function () {
    return {
        id: this._id.toString(),
        name: this.name,
        description: this.description,
        ownerId: this.ownerId.toString(),
        status: this.status,
        framework: this.framework,
        repositoryUrl: this.repositoryUrl,
        githubRepoId: this.githubRepoId,
        githubFullName: this.githubFullName,
        isPrivateRepo: this.isPrivateRepo,
        branch: this.branch,
        isIndexed: this.isIndexed,
        indexedAt: this.indexedAt ? this.indexedAt.toISOString() : undefined,
        fileCount: this.fileCount,
        testHealthScore: this.testHealthScore,
        securityScore: this.securityScore,
        codeQualityScore: this.codeQualityScore,
        createdAt: this.createdAt.toISOString(),
        updatedAt: this.updatedAt.toISOString(),
    };
};
exports.Project = mongoose_1.default.model('Project', ProjectSchema);
