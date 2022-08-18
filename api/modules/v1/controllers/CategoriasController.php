<?php

namespace app\modules\v1\controllers;


use app\filters\auth\HttpBearerAuth;
use app\models\Categorias;
use app\models\CategoriasEditForm;
use app\models\CategoriasSearch;
use Yii;
use yii\filters\AccessControl;
use yii\filters\auth\CompositeAuth;
use yii\helpers\Url;
use yii\rest\ActiveController;
use yii\web\BadRequestHttpException;
use yii\web\HttpException;
use yii\web\NotFoundHttpException;
use yii\web\ServerErrorHttpException;

/**
 * CategoriasController implements the CRUD actions for Categorias model.
 */
class CategoriasController extends ActiveController
{

    public $modelClass = 'app\models\Categorias';

    public function __construct($id, $module, $config = [])
    {
        parent::__construct($id, $module, $config);
    }
    public function actions()
    {
        return [];
    }
    /**
     * @inheritDoc
     */
    public function behaviors()
    {
        $behaviors = parent::behaviors();

        $behaviors['authenticator'] = [
            'class' => CompositeAuth::className(),
            'authMethods' => [
                HttpBearerAuth::className(),
            ],

        ];

        $behaviors['verbs'] = [
            'class' => \yii\filters\VerbFilter::className(),
            'actions' => [
                'index' => ['get'],
                'view' => ['get'],
                'create' => ['post'],
                'update' => ['put'],
                'delete' => ['delete'],
                'login' => ['post'],
            ],
        ];

        // remove authentication filter
        $auth = $behaviors['authenticator'];
        unset($behaviors['authenticator']);

        // add CORS filter
        $behaviors['corsFilter'] = [
            'class' => \yii\filters\Cors::className(),
            'cors' => [
                'Origin' => ['*'],
                'Access-Control-Request-Method' => ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
                'Access-Control-Request-Headers' => ['*'],
            ],
        ];
        // re-add authentication filter
        $behaviors['authenticator'] = $auth;
        // avoid authentication on CORS-pre-flight requests (HTTP OPTIONS method)
        $behaviors['authenticator']['except'] = ['options', 'login'];
        // setup access
        $behaviors['access'] = [
            'class' => AccessControl::className(),
            'only' => ['index', 'view', 'create', 'update', 'delete'], //only be applied to
            'rules' => [
                [
                    'allow' => true,
                    'actions' => ['index', 'view', 'create', 'update', 'delete'],
                    'roles' => ['admin', 'manageCategorias'],
                ],
                [
                    'allow' => true,
                    'roles' => ['categorias']
                ]
            ],
        ];

        return $behaviors;
    }

    /**
     * Search users
     *
     * @return array
     * @throws BadRequestHttpException
     */
    public function actionIndex()
    {

        $search = new CategoriasSearch();
        $search->load(\Yii::$app->request->get());
        $search->in_roles = [Categorias::ROLE_USER];
        $search->not_in_status = [Categorias::STATUS_DELETED];

        if (!$search->validate()) {
            throw new BadRequestHttpException(
                'Invalid parameters: ' . json_encode($search->getErrors())
            );
        }

        return $search->getDataProvider();
    }

    /**
     * View categoria
     *
     * @param $id
     * @return array|null|\yii\db\ActiveRecord
     * @throws NotFoundHttpException
     */
    public function actionView($id)
    {
        $staff = Categorias::find()->where(
            [
                'id' => $id
            ]
        )->one();

        if ($staff) {
            return $staff;
        } else {
            throw new NotFoundHttpException("Object not found: $id");
        }
    }

    /**
     * Create new user
     *
     * @return Categorias
     * @throws HttpException
     * @throws \yii\base\InvalidConfigException
     */
    public function actionCreate()
    {
        $model = new Categorias();
        $model->load(\Yii::$app->getRequest()->getBodyParams(), '');

        if ($model->validate() && $model->save()) {
            $response = \Yii::$app->getResponse();
            $response->setStatusCode(201);
            $id = implode(',', array_values($model->getPrimaryKey(true)));
            $response->getHeaders()->set('Location', Url::toRoute([$id], true));
        } else {
            // Validation error
            throw new HttpException(422, json_encode($model->errors));
        }

        return $model;
    }

    /**
     * Update categoria
     *
     * @param $id
     * @return array|null|\yii\db\ActiveRecord
     * @throws HttpException
     * @throws NotFoundHttpException
     * @throws \yii\base\InvalidConfigException
     */
    public function actionUpdate($id)
    {
        $model = $this->actionView($id);
        $model->load(\Yii::$app->getRequest()->getBodyParams(), '');

        if ($model->validate() && $model->save()) {
            $response = \Yii::$app->getResponse();
            $response->setStatusCode(200);
        } else {
            // Validation error
            throw new HttpException(422, json_encode($model->errors));
        }

        return $model;
    }


    /**
     * Delete categoria
     *
     * @param $id
     * @return string
     * @throws NotFoundHttpException
     * @throws ServerErrorHttpException
     */
    public function actionDelete($id)
    {

        $model = $this->actionView($id);

        if ($model->delete()) {
            $response = \Yii::$app->getResponse();
            $response->setStatusCode(204);
        } else {
            throw new ServerErrorHttpException('Failed to delete the object for unknown reason.');
        }

        return $model;
    }

    /**
     * Finds the Categorias model based on its primary key value.
     * If the model is not found, a 404 HTTP exception will be thrown.
     * @param int $id ID
     * @return Categorias the loaded model
     * @throws NotFoundHttpException if the model cannot be found
     */
    protected function findModel($id)
    {
        if (($model = Categorias::findOne(['id' => $id])) !== null) {
            return $model;
        }

        throw new NotFoundHttpException('The requested page does not exist.');
    }
}
